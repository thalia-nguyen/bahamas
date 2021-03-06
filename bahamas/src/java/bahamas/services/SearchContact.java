/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bahamas.services;

import bahamas.dao.ContactDAO;
import bahamas.dao.RoleCheckDAO;
import bahamas.dao.SearchContactDAO;
import bahamas.entity.Contact;
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
import java.util.ArrayList;
import java.util.HashMap;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author tan.si.hao
 */
@WebServlet(name = "SearchContact", urlPatterns = {"/contact.search"})
public class SearchContact extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
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
                JsonElement jelement = new JsonParser().parse(jsonLine);
                JsonObject jobject = jelement.getAsJsonObject();
                String token = Validator.containsBlankField(jobject.get("token"));
                String name = Validator.containsBlankField(jobject.get("name"));
                String altname = Validator.containsBlankField(jobject.get("altname"));
                String nationality = Validator.containsBlankField(jobject.get("nationality"));
                String team = Validator.containsBlankField(jobject.get("team"));
                String ifOther = Validator.containsBlankField(jobject.get("ifOther"));
                String appreciation = Validator.containsBlankField(jobject.get("appreciation"));
                String language = Validator.containsBlankField(jobject.get("language"));
                String skill = Validator.containsBlankField(jobject.get("skill"));
                String otherLanguage = Validator.containsBlankField(jobject.get("if_language_other"));
                String otherSkill = Validator.containsBlankField(jobject.get("if_skill_other"));
                String username = Authenticator.verifyToken(token);
                if (username == null) {
                    json.addProperty("message", "invalid token");
                    out.println(gson.toJson(json));
                } else {
                    ContactDAO cDAO = new ContactDAO();
                    Contact contact = cDAO.retrieveContactByUsername(username);
                    //if (contact.isIsAdmin() || RoleCheckDAO.checkRole(contact.getContactId(), "teammanager")) {
                    if (!contact.isIsNovice()) {
                        HashMap<Integer, Contact> contactHM = null;
                        if (name != null || altname != null || nationality != null) {
                            contactHM = SearchContactDAO.searchContactByNameAltnameNationality(name, altname, nationality);
                        }
                        if (contactHM == null && team != null) {
                            if(team.equalsIgnoreCase("other")){
                                contactHM = SearchContactDAO.searchContactByTeam(ifOther, true);
                            } else {
                                contactHM = SearchContactDAO.searchContactByTeam(team, false);
                            }
                        } else if (contactHM != null && team != null) {
                            HashMap<Integer, Contact> tempHM = null;
                            if(team.equalsIgnoreCase("other")){
                                tempHM = SearchContactDAO.searchContactByTeam(ifOther, true);
                            } else {
                                tempHM = SearchContactDAO.searchContactByTeam(team, false);
                            }
                            contactHM.keySet().retainAll(tempHM.keySet());
                        }
                        if(!contact.isIsNovice()){
                            if (contactHM == null && appreciation != null) {
                                contactHM = SearchContactDAO.searchContactByAppreciationGesture(appreciation);
                            } else if (contactHM != null && appreciation != null) {
                                HashMap<Integer, Contact> tempHM = SearchContactDAO.searchContactByAppreciationGesture(appreciation);
                                contactHM.keySet().retainAll(tempHM.keySet());
                            }
                        }
                        if (contactHM == null && language != null) {
                            if(language.equalsIgnoreCase("other")){
                                contactHM = SearchContactDAO.searchContactByLanguageName(otherLanguage, true);
                            } else {
                                contactHM = SearchContactDAO.searchContactByLanguageName(language, false);
                            }
                        } else if (contactHM != null && language != null) {
                            if(language.equalsIgnoreCase("other")){
                                HashMap<Integer, Contact> tempHM = SearchContactDAO.searchContactByLanguageName(otherLanguage, true);
                                contactHM.keySet().retainAll(tempHM.keySet());
                            } else {
                                HashMap<Integer, Contact> tempHM = SearchContactDAO.searchContactByLanguageName(language, false);
                                contactHM.keySet().retainAll(tempHM.keySet());
                            }
                        }
                        if (contactHM == null && skill != null) {
                            if(skill.equalsIgnoreCase("other")){
                                contactHM = SearchContactDAO.searchContactBySkillName(otherSkill, true);
                            } else {
                                contactHM = SearchContactDAO.searchContactBySkillName(skill, false);
                            }
                        } else if (contactHM != null && skill != null) {
                            if(skill.equalsIgnoreCase("other")){
                                HashMap<Integer, Contact> tempHM = SearchContactDAO.searchContactBySkillName(otherSkill, true);
                                contactHM.keySet().retainAll(tempHM.keySet());
                            }else {
                                HashMap<Integer, Contact> tempHM = SearchContactDAO.searchContactBySkillName(skill, false);
                                contactHM.keySet().retainAll(tempHM.keySet());
                            }
                        }
                        json.addProperty("message", "success");
                        JsonArray contactArray = new JsonArray();
                        JsonObject jsonContactObj;
                        ContactDAO contactDAO = new ContactDAO();
                        ArrayList<Contact> contactList = contactDAO.retrieveAllContactWithEmailPhone();
                        HashMap<Integer, Contact> contactidContactHM = new HashMap<Integer, Contact>();
                        for(Contact contactTemp:contactList){
                            contactidContactHM.put(contactTemp.getContactId(), contactTemp);
                        }
                        
                        for (int tempContactId : contactHM.keySet()) {
                            Contact tempContact = contactHM.get(tempContactId);
                            jsonContactObj = new JsonObject();
                            jsonContactObj.addProperty("contactid", tempContact.getContactId());
                            jsonContactObj.addProperty("name", tempContact.getName());
                            jsonContactObj.addProperty("contacttype", tempContact.getContactType());
                            if(contactidContactHM.get(tempContactId).getEmailStrList() != null){
                                jsonContactObj.addProperty("email", contactidContactHM.get(tempContactId).getEmailStrList());
                            } else {
                                jsonContactObj.addProperty("email", "");
                            }
                            contactArray.add(jsonContactObj);
                        }
                        json.add("contact", contactArray);
                        out.println(gson.toJson(json));
                    } else {
                        json.addProperty("message", "fail");
                        out.println(gson.toJson(json));
                    }
                }

            }
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
