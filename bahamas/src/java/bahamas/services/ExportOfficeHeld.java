/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bahamas.services;

import bahamas.dao.OfficeHeldDAO;
import bahamas.entity.OfficeHeld;
import bahamas.util.Authenticator;
import bahamas.util.Validator;
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
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Darryl Mok
 */
@WebServlet(name = "ExportOfficeHeld", urlPatterns = {"/export.officeheld"})
public class ExportOfficeHeld extends HttpServlet {

    /**
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
                json.addProperty("message", "json empty");
                out.println(gson.toJson(json));
                
            } else {
                //Parse json object
                JsonElement jelement = new JsonParser().parse(jsonLine);
                JsonObject jobject = jelement.getAsJsonObject();
                String token = Validator.containsBlankField(jobject.get("token"));
                //String cidString = jobject.get("cid").getAsString();
                //Optional for admin and novice
                //String teamName = jobject.get("teamname").getAsString();
                //String permission = jobject.get("permission").getAsString();

                if ((token == null || token.isEmpty())) {
                    json.addProperty("message", "no token");
                    out.println(gson.toJson(json));
                    return;
                }

                String username = Authenticator.verifyToken(token);
                if (username == null) {
                    json.addProperty("message", "invalid token");
                    out.println(gson.toJson(json));
                    return;
                }
                
                OfficeHeldDAO officeHeldDAO = new OfficeHeldDAO();
                ArrayList<OfficeHeld> aList = officeHeldDAO.retrieveAllOfficeHeld();

                SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd-MMM-yyyy");
                SimpleDateFormat sdft = new java.text.SimpleDateFormat("dd-MMM-yyyy HH:mm:ss");
                JsonArray officeHeldArray = new JsonArray();

                //start
                if (aList != null && !aList.isEmpty()) {

                    for (int i = 0; i < aList.size(); i++) {
                        JsonObject jsonOfficeHeldObj = new JsonObject();
                        OfficeHeld officeHeld = aList.get(i);

                        if (officeHeld.getContactId() > 0) {
                            jsonOfficeHeldObj.addProperty("cid", officeHeld.getContactId());
                        } else {
                            jsonOfficeHeldObj.addProperty("cid", "");
                        }

                        jsonOfficeHeldObj.addProperty("officeheld", officeHeld.getOfficeHeldPosition());

                        
                        if (officeHeld.getStartOffice()!= null) {
                            jsonOfficeHeldObj.addProperty("start_officeHeld", sdf.format(officeHeld.getStartOffice()));
                        } else {
                            jsonOfficeHeldObj.addProperty("start_officeHeld", "");
                        }
                        if (officeHeld.getEndOffice() != null) {
                            jsonOfficeHeldObj.addProperty("end_officeHeld", sdf.format(officeHeld.getEndOffice()));
                        } else {
                            jsonOfficeHeldObj.addProperty("end_officeHeld", "");
                        }
                        
                        if (officeHeld.getRemarks() != null) {
                            jsonOfficeHeldObj.addProperty("remarks", officeHeld.getRemarks());
                        } else {
                            jsonOfficeHeldObj.addProperty("remarks", "");
                        }
                        
                        jsonOfficeHeldObj.addProperty("created_by", officeHeld.getCreatedBy());
                        jsonOfficeHeldObj.addProperty("date_created", sdft.format(officeHeld.getDateCreated()));
                        officeHeldArray.add(jsonOfficeHeldObj);

                    }
                    json.addProperty("message", "success");
                    json.add("list", officeHeldArray);
                } else {

                    json.addProperty("message", "officeheld table is empty");
                    out.println(gson.toJson(json));
                    return;
                }

            }

            out.println(gson.toJson(json));
        }

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