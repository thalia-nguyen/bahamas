/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bahamas.services;

import bahamas.dao.AuditLogDAO;
import bahamas.dao.ContactDAO;
import bahamas.dao.EventAffiliationDAO;
import bahamas.dao.EventDAO;
import bahamas.dao.RoleCheckDAO;
import bahamas.dao.TeamJoinDAO;
import bahamas.entity.Contact;
import bahamas.entity.Event;
import bahamas.entity.EventAffiliation;
import bahamas.entity.TeamJoin;
import bahamas.util.Authenticator;
import bahamas.util.InAppNotificationSender;
import bahamas.util.Validator;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;
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
@WebServlet(name = "UpdateTeamAffiliation", urlPatterns = {"/event.updateteamaffiliation"})
public class UpdateTeamAffiliation extends HttpServlet {

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
                String explainIfOthers = "";
                HashMap<String, String> formTeamHM = new HashMap<String, String>();
                boolean teamIncluded = false;
                
                if (jobject.has("explain_if_other")) {
                    explainIfOthers = jobject.get("explain_if_other").getAsString();
                }

                JsonArray eventTeamsJsonArray = jobject.get("teams").getAsJsonArray();
                String username = Authenticator.verifyToken(token);
                JsonArray errorMsg = new JsonArray();
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
                        EventDAO eventDAO = new EventDAO();
                        Event event = eventDAO.retrieveEventById(Integer.parseInt(eventId));
                        HashMap<String, String> hmError = new HashMap<String, String>();
                        ArrayList<String> teamName = new ArrayList<String>();
                        if (event != null) {
                            //insert Team Affiliation here 
                            for (int i = 0; i < eventTeamsJsonArray.size(); i++) {
                                String teamTemp = eventTeamsJsonArray.get(i).getAsString();
                                //JsonObject jsonObj = jsonElement.getAsJsonObject();
                                //String teamTemp = jsonElement.getAsString();
                                if (hmError.containsKey(teamTemp)) {
                                    json.addProperty("message", "There should not be two or more of the same team in an event");
                                    out.println(gson.toJson(json));
                                    return;
                                } else {
                                    hmError.put(teamTemp, teamTemp);
                                    teamName.add(teamTemp);
                                    formTeamHM.put(teamTemp, teamTemp);
                                }
                            }

                            if (contact.isIsAdmin() || RoleCheckDAO.checkRole(contact.getContactId(), "teammanager") || RoleCheckDAO.checkRole(contact.getContactId(), "eventleader")) {
                                if (RoleCheckDAO.checkRole(contact.getContactId(), "teammanager") || RoleCheckDAO.checkRole(contact.getContactId(), "eventleader")) {
                                    ArrayList<TeamJoin> teamJoinList = TeamJoinDAO.validTeamJoin(contact.getContactId());
                                    for (TeamJoin teamJoin : teamJoinList) {
                                        if (formTeamHM.containsKey(teamJoin.getTeamName())) {
                                            teamIncluded = true;

                                        }
                                    }
                                }
                                if (!contact.isIsAdmin() && !teamIncluded) {
                                    json.addProperty("message", "error");
                                    errorMsg.add(new JsonPrimitive("Your team should also be selected."));
                                    json.add("errorMsg", errorMsg);
                                    out.println(gson.toJson(json));
                                    return;
                                }
                            } else {
                                json.addProperty("message", "fail");
                                out.println(gson.toJson(json));
                                return;
                            }
                            
                            EventAffiliation eventAffiliation = new EventAffiliation(Integer.parseInt(eventId), explainIfOthers, teamName, username);

                            if (EventAffiliationDAO.updateTeamAffiliation(eventAffiliation, eventAffiliation.getEventID())) {
                                AuditLogDAO.insertAuditLog(username, "UPDATE TEAM AFFILIATION IN EVENT", "Update Team Affiliation in event under contact: Contact ID: " + contact.getContactId() + " | Event ID: " + eventId);
                                AuditLogDAO.insertAuditLog(username, "UPDATE EVENT", "Update event under contact: Contact ID: " + contact.getContactId() + " | Event ID: " + event.getEventId());
                                HashMap<String, String> teamHM = new HashMap<String, String>();
                                EventAffiliation eventAffiliation2 = EventAffiliationDAO.retrieveAllEventAffiliation(Integer.parseInt(eventId));
                                for (String tempTeam : eventAffiliation2.getTeamArray()) {
                                    teamHM.put(tempTeam, tempTeam);
                                }
                                HashMap<Integer, String> cidNamePairHM = new HashMap<Integer, String>();
                                ContactDAO contactDAO = new ContactDAO();
                                ArrayList<Contact> contactList = contactDAO.retrieveAllContactInTeams(teamName);
                                for(Contact tempContact : contactList){
                                    cidNamePairHM.put(tempContact.getContactId(), tempContact.getName());
                                }

                                new Thread(() -> {
                                    // Send notification in a separate thread
                                    InAppNotificationSender.updateDetailsNotification(cidNamePairHM, event.getEventId(), event.getEventTitle(), contact);
                                }).start();
                                
                                json.addProperty("message", "success");
                                out.println(gson.toJson(json));
                                return;
                            }
                            json.addProperty("message", "Fail retrieve event");
                            out.println(gson.toJson(json));
                        } else {
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
