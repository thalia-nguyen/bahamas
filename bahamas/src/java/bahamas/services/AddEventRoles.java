/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bahamas.services;

import bahamas.dao.AuditLogDAO;
import bahamas.dao.ContactDAO;
import bahamas.dao.EventDAO;
import bahamas.dao.EventRoleAssignmentDAO;
import bahamas.entity.Contact;
import bahamas.entity.Event;
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
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author tan.si.hao
 */
@WebServlet(name = "AddEventRoles", urlPatterns = {"/event.addroles"})
public class AddEventRoles extends HttpServlet {

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
                String eventId = Validator.containsBlankField(jobject.get("event_id"));
                JsonArray eventRolesJsonArray = jobject.get("roleArray").getAsJsonArray();
                String username = Authenticator.verifyToken(token);
                JsonArray eventIdJsonArray = jobject.get("event_id_list").getAsJsonArray();
                               
                if (username == null) {
                    json.addProperty("message", "invalid token");
                    out.println(gson.toJson(json));
                } else {
                    //Verified token
                    ContactDAO cDAO = new ContactDAO();
                    Contact contact = cDAO.retrieveContactByUsername(username);

                    if (contact == null) {
                        json.addProperty("message", "fail");
                        out.println(gson.toJson(json));
                        return;
                    } else {    
                        //Only Admin and tm are able to add roles to event an event
                            
                        EventDAO eventDAO = new EventDAO();
                        Event event = eventDAO.retrieveEventById(Integer.parseInt(eventId));
                        
                        if(event != null){
                            //insert roles here
                            String roleTemp = "role";
                            String descriptionTemp = "description";
                            boolean formError = false;
                            for(int i = 0; i < eventRolesJsonArray.size(); i++){
                                JsonElement jsonElement = eventRolesJsonArray.get(i);
                                JsonObject jsonObj = jsonElement.getAsJsonObject();
                                String role = jsonObj.get(roleTemp + (i+1)).getAsString();
                                String description = jsonObj.get(descriptionTemp + (i+1)).getAsString();
                                
                                if(role.isEmpty() && !description.isEmpty()){
                                    formError = true;
                                }
                            }
                            if(formError){
                                json.addProperty("message", "There is an error in the form.");
                                out.println(gson.toJson(json));
                                return;
                            }
                            for(int i = 0; i < eventIdJsonArray.size(); i++){
                                String eventIdTemp = eventIdJsonArray.get(i).getAsString();
                                if(EventRoleAssignmentDAO.addRoles(eventRolesJsonArray, Integer.parseInt(eventIdTemp))){
                                    AuditLogDAO.insertAuditLog(username, "ADD EVENT ROLES", "Add event roles under contact: Contact ID: " + contact.getContactId() + " | Event ID: " + eventIdTemp);
                                } else {
                                    json.addProperty("message", "Fail retrieve event");
                                    out.println(gson.toJson(json));
                                    return;
                                }
                            }                          
                            json.addProperty("message", "success");
                            out.println(gson.toJson(json));
                        }else{
                            json.addProperty("message", "Fail retrieve event");
                            out.println(gson.toJson(json));
                        }
                                
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
