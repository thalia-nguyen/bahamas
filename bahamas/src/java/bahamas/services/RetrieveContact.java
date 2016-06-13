/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bahamas.services;

import bahamas.dao.ContactDAO;
import bahamas.dao.RoleCheckDAO;
import bahamas.entity.Contact;
import bahamas.util.Authenticator;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author HUXLEY
 */
@WebServlet(name = "RetrieveContact", urlPatterns = {"/contact.retrieve"})
public class RetrieveContact extends HttpServlet {

    private static final SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd-MMM-yyyy");

    /*
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/JSON;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            JsonObject json = new JsonObject();
            Gson gson = new GsonBuilder().setPrettyPrinting().create();

            //Retrieve the json string as a reader 
            StringBuilder sb = new StringBuilder();
            try {
                BufferedReader reader = request.getReader();
                String line = null;
                while ((line = reader.readLine()) != null) {
                    sb.append(line);
                }
            } catch (Exception e) {
                json.addProperty("message", "fail");
                out.println(gson.toJson(json));
                return;
            }

            String jsonLine = sb.toString();
            if (jsonLine == null || jsonLine.isEmpty()) {
                json.addProperty("message", "fail");
                out.println(gson.toJson(json));

            } else {

                //Parse json object
                JsonElement jelement = new JsonParser().parse(jsonLine);
                JsonObject jobject = jelement.getAsJsonObject();
                String token = jobject.get("token").getAsString();
                String cidString = jobject.get("cid").getAsString();
                //Optional for admin and novice
                String teamName = jobject.get("teamname").getAsString();
                String permission = jobject.get("permission").getAsString();

                if ((token == null || token.isEmpty()) || (cidString == null || cidString.isEmpty()) || (permission == null || permission.isEmpty())) {
                    json.addProperty("message", "fail");
                    out.println(gson.toJson(json));
                    return;
                }

                String username = Authenticator.verifyToken(token);
                ContactDAO contactDAO = new ContactDAO();
                Contact contact = contactDAO.retrieveContactByUsername(username);

                //ContactDAO contactDAO = new ContactDAO();
                ArrayList<Contact> contactList = contactDAO.retrieveAllContact();

                if (!contactList.isEmpty()) {

                    json.addProperty("message", "success");
                    //Novice
                    if (contact.isIsNovice()) {

                        JsonArray contactArray = retrieveAllByNovice(contactList);
                        json.add("contact", contactArray);
                        out.println(gson.toJson(json));
                        return;
                        
                    } else if (contact.isIsAdmin()) { //Admin
                        JsonArray contactArray = retrieveAllByAdminTm(contactList);
                        json.add("contact", contactArray);
                        out.println(gson.toJson(json));
                        return;
                    } else if (RoleCheckDAO.checkRole(contact.getContactId(), permission) && permission.equals("teammanager")) { //Team manager
                        JsonArray contactArray = retrieveAllByAdminTm(contactList);
                        json.add("contact", contactArray);
                        out.println(gson.toJson(json));
                        return;
                    } else {
                        int cid = Integer.parseInt(cidString);
                        //check permission, 
                        if (RoleCheckDAO.checkRole(cid, teamName, permission)) {

                            if (permission.equals("eventleader")) { //Event leader
                                // To be confirm
                                JsonArray contactArray = retrieveAllByAdminTm(contactList);
                                json.add("contact", contactArray);
                                out.println(gson.toJson(json));
                                return;
                            } else if (permission.equals("associate")) { //Associate
                                // To be confirm
                                JsonArray contactArray = retrieveAllByAssociate(contactList);
                                json.add("contact", contactArray);
                                out.println(gson.toJson(json));
                                return;
                            }
                        }

                    }

                    //}
                } else {

                    json.addProperty("message", "fail");
                    out.println(gson.toJson(json));
                }
                json.addProperty("message", "fail");
                out.println(gson.toJson(json));
            }

        }
    }

    private static JsonArray retrieveAllByAdminTm(ArrayList<Contact> contactList) {

        JsonArray contactArray = new JsonArray();
        JsonObject jsonContactObj;

        for (Contact c : contactList) {

            jsonContactObj = new JsonObject();
            jsonContactObj.addProperty("name", c.getName());
            jsonContactObj.addProperty("altname", c.getAltName());
            jsonContactObj.addProperty("phone", "not completed");
            jsonContactObj.addProperty("email", "not completed");
            jsonContactObj.addProperty("contacttype", c.getContactType());
            jsonContactObj.addProperty("explainifother", c.getExplainIfOther());
            jsonContactObj.addProperty("contacttype", c.getContactType());
            jsonContactObj.addProperty("profession", c.getProfession());
            jsonContactObj.addProperty("jobtitle", c.getJobTitle());
            jsonContactObj.addProperty("nric", c.getNric());
            jsonContactObj.addProperty("gender", c.getGender());
            jsonContactObj.addProperty("nationality", c.getNationality());
            jsonContactObj.addProperty("dateofbirth", sdf.format(c.getDateOfBirth()));
            jsonContactObj.addProperty("address", "not completed");
            jsonContactObj.addProperty("remarks", c.getRemarks());
            //jsonContactObj.addProperty("username", c.getName());
            //jsonContactObj.addProperty("password", c.getPassword());
            //jsonContactObj.addProperty("dateCreated", sdf.format(c.getDateCreated()));
            //jsonContactObj.addProperty("createdBy", c.getCreatedBy());
            //jsonContactObj.addProperty("profilePic", c.getProfilePic());
            contactArray.add(jsonContactObj);

        }
        return contactArray;
    }

    private static JsonArray retrieveAllByNovice(ArrayList<Contact> contactList) {

        JsonArray contactArray = new JsonArray();
        JsonObject jsonContactObj;

        for (Contact c : contactList) {

            jsonContactObj = new JsonObject();

            jsonContactObj.addProperty("name", c.getName());
            jsonContactObj.addProperty("altname", c.getAltName());
            jsonContactObj.addProperty("email", "not completed");
            contactArray.add(jsonContactObj);

        }
        return contactArray;
    }
    
    private static JsonArray retrieveAllByAssociate(ArrayList<Contact> contactList) {

        JsonArray contactArray = new JsonArray();
        JsonObject jsonContactObj;

        for (Contact c : contactList) {

            jsonContactObj = new JsonObject();

            jsonContactObj.addProperty("name", c.getName());
            jsonContactObj.addProperty("altname", c.getAltName());
            jsonContactObj.addProperty("email", "not completed");
            jsonContactObj.addProperty("contactType", c.getContactType());
            jsonContactObj.addProperty("explainIfOther", c.getExplainIfOther());
            jsonContactObj.addProperty("contactType", c.getContactType());
            jsonContactObj.addProperty("profession", c.getProfession());
            jsonContactObj.addProperty("jobTitle", c.getJobTitle());
            jsonContactObj.addProperty("gender", c.getGender());
            jsonContactObj.addProperty("nationality", c.getNationality());
            jsonContactObj.addProperty("remarks", c.getRemarks());
            contactArray.add(jsonContactObj);

        }
        return contactArray;
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
