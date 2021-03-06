/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bahamas.services;

import bahamas.dao.AppNotificationDAO;
import bahamas.dao.AuditLogDAO;
import bahamas.dao.ContactDAO;
import bahamas.dao.EventDAO;
import bahamas.dao.EventParticipantDAO;
import bahamas.dao.RoleCheckDAO;
import bahamas.entity.AppNotification;
import bahamas.entity.Contact;
import bahamas.entity.Event;
import bahamas.entity.EventParticipant;
import bahamas.util.Authenticator;
import bahamas.util.Validator;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author tan.si.hao
 */
@WebServlet(name = "LeaveEventRole", urlPatterns = {"/event.leaverole"})
public class LeaveEventRole extends HttpServlet {

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
                String roleId = Validator.containsBlankField(jobject.get("role_id"));
                String reason = Validator.containsBlankField(jobject.get("reason"));
                String withdrawerId = Validator.containsBlankField(jobject.get("withdraw_contact_id"));
                String username = Authenticator.verifyToken(token);
                SimpleDateFormat date = new SimpleDateFormat("dd-MMM-yyyy");

                if (username == null) {
                    json.addProperty("message", "invalid token");
                    out.println(gson.toJson(json));
                } else {
                    //Verified token
                    ContactDAO cDAO = new ContactDAO();
                    Contact contact = cDAO.retrieveContactByUsername(username);

                    if (contact == null || roleId == null || reason == null || withdrawerId == null) {
                        json.addProperty("message", "fail");
                        out.println(gson.toJson(json));
                        return;
                    } else {
                        EventParticipant eventParticipant = null;

                        if (Integer.parseInt(withdrawerId) == contact.getContactId()) {
                            eventParticipant = EventParticipantDAO.retrieveParticipantbyRoleIDContactID(Integer.parseInt(roleId), contact.getContactId());
                        } else {
                            if (contact.isIsAdmin() || RoleCheckDAO.checkRole(contact.getContactId(), "teammanager") || RoleCheckDAO.checkRole(contact.getContactId(), "eventleader")) {
                                eventParticipant = EventParticipantDAO.retrieveParticipantbyRoleIDContactID(Integer.parseInt(roleId), Integer.parseInt(withdrawerId));
                            }
                        }

                        if (eventParticipant != null) {
                            eventParticipant.setReason(reason);
                            eventParticipant.setPullout(true);
                            eventParticipant.setDatepullout(new java.util.Date());
                            if (EventParticipantDAO.updateEventRole(eventParticipant)) {
                                EventDAO eventDAO = new EventDAO();
                                Event event = eventDAO.retrieveEventById(eventParticipant.getEventID());
                                Contact contactTemp = cDAO.retrieveContactById(eventParticipant.getContactID());
                                ContactDAO contactDAO = new ContactDAO();
                                if (contactDAO.retrieveContactById(event.getContactId()).getUsername() != null && event.getContactId() != contact.getContactId()) {
                                    AppNotification appNotification = new AppNotification(event.getContactId(), eventParticipant.getEventID(), ".viewIndivEvent", contactTemp.getName() + " left " + date.format(event.getEventStartDate()) + " event \"" + event.getEventTitle() + "\". Click to view event.");
                                    AppNotificationDAO.addAppNotification(appNotification);
                                } else if (contactDAO.retrieveContactById(eventParticipant.getContactID()).getUsername() != null && eventParticipant.getContactID() != contact.getContactId()) {
                                    AppNotification appNotification = new AppNotification(eventParticipant.getContactID(), eventParticipant.getEventID(), ".viewIndivEvent", "You have been removed from \"" + date.format(event.getEventStartDate()) + " event \"" + event.getEventTitle() + "\" . Click to view event.");
                                    AppNotificationDAO.addAppNotification(appNotification);
                                }

                                int participantNumber = event.getParticipantNumber();
                                event.setParticipantNumber(participantNumber - 1);
                                if (!EventDAO.updateEventDetails(event)) {
                                    json.addProperty("message", "Fail to add update event table");
                                    out.println(gson.toJson(json));
                                }

                                AuditLogDAO.insertAuditLog(username, "LEAVE EVENT ROLES", "Leave event roles under contact: Contact ID: " + withdrawerId + " | Event Role ID: " + roleId);
                                json.addProperty("message", "success");
                            } else {
                                json.addProperty("message", "Fail update participant");
                            }
                            out.println(gson.toJson(json));
                        } else {
                            json.addProperty("message", "Fail update participant");
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
