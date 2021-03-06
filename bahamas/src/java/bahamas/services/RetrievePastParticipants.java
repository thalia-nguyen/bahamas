package bahamas.services;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import bahamas.dao.ContactDAO;
import bahamas.dao.EventAffiliationDAO;
import bahamas.dao.EventDAO;
import bahamas.dao.EventParticipantDAO;
import bahamas.dao.EventRoleAssignmentDAO;
import bahamas.dao.RoleCheckDAO;
import bahamas.dao.TeamJoinDAO;
import bahamas.entity.Contact;
import bahamas.entity.Event;
import bahamas.entity.EventAffiliation;
import bahamas.entity.EventParticipant;
import bahamas.entity.EventRoleAssignment;
import bahamas.entity.TeamJoin;
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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author tan.si.hao
 */
@WebServlet(urlPatterns = {"/event.pastparticipants"})
public class RetrievePastParticipants extends HttpServlet {

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
            SimpleDateFormat date = new SimpleDateFormat("dd-MMM-yyyy");
            SimpleDateFormat time = new SimpleDateFormat("hh:mm a");
            SimpleDateFormat day = new SimpleDateFormat("EEE");

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
                String teamNameFilter = "";
                String username = Authenticator.verifyToken(token);
                if (jobject.has("teamFilter")) {
                    teamNameFilter = jobject.get("teamFilter").getAsString();
                }

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
                        //Get all teams this user has
                        HashMap<String, String> hmTeamPermission = new HashMap<String, String>();
                        ArrayList<TeamJoin> teamJoinList = TeamJoinDAO.retrieveAllTeamJoinCID(contact.getContactId());
                        try {
                            Date currentDateTime = new Date();
                            Date currentDate = date.parse(date.format(currentDateTime));
                            Date obsDate = null;
                            for (TeamJoin teamJoin : teamJoinList) {
                                if (teamJoin.getDateObsolete() != null) {
                                    obsDate = date.parse(date.format(teamJoin.getDateObsolete()));
                                }
                                if (obsDate == null || obsDate.equals(currentDate) || obsDate.after(currentDate)) {
                                    if(teamJoin.getPermission() != null){
                                        hmTeamPermission.put(teamJoin.getTeamName(), teamJoin.getPermission());
                                    }
                                }
                            }
                        } catch (ParseException ex) {
                            Logger.getLogger(RetrieveUpcomingParticipants.class.getName()).log(Level.SEVERE, null, ex);
                            json.addProperty("message", "fail");
                            out.println(gson.toJson(json));
                            return;
                        }

                        EventDAO eventDAO = new EventDAO();
                        //ArrayList<Event> eventList = eventDAO.retrieveAllEventsGroupByEventTitle();
                        ArrayList<Event> eventList = eventDAO.retrieveAllEventsASC();

                        JsonArray eventArray = new JsonArray();
                        JsonObject jsonContactObj;
                        if (eventList != null) {
                            json.addProperty("message", "success");
                            for (int i = 0; i < eventList.size(); i++) {
                                Event event = eventList.get(i);
                                Date currentDateTime = new Date();
                                try {
                                    Date currentDate = date.parse(date.format(currentDateTime));
                                    Date currentTime = time.parse(time.format(currentDateTime));
                                    Date eventEndDate = date.parse(date.format(event.getEventEndDate()));
                                    Date eventEndTime = time.parse(time.format(event.getEventEndTime()));
                                    if (eventEndDate.before(currentDate) || (eventEndDate.equals(currentDate) && eventEndTime.before(currentTime))) {

                                        ArrayList<EventParticipant> eventParticipantList = EventParticipantDAO.retrieveEventParticipantbyEventID(event.getEventId());
                                        ArrayList<EventRoleAssignment> eventRoleAssignmentList = EventRoleAssignmentDAO.retrieveEventRoleById(event.getEventId());
                                        EventAffiliation eventAffiliation = EventAffiliationDAO.retrieveAllEventAffiliation(event.getEventId());
                                        jsonContactObj = new JsonObject();
                                        JsonArray eventRoleJsonArray = new JsonArray();

                                        jsonContactObj.addProperty("event_id", event.getEventId());
                                        jsonContactObj.addProperty("event_title", event.getEventTitle());
                                        String eventInfo = date.format(event.getEventStartDate()) + " (" + day.format(event.getEventStartDate()) + "), " + time.format(event.getEventStartTime()) + ", " + event.getEventLocationName();
                                        jsonContactObj.addProperty("event_info", eventInfo);
                                        jsonContactObj.addProperty("event_start_date", date.format(event.getEventStartDate()));
                                        jsonContactObj.addProperty("event_time_start", time.format(event.getEventStartTime()));
                                        HashMap<String, String> eventTeamsHM = new HashMap<String, String>();
                                        if (eventAffiliation != null) {
                                            String teamTemp = "";
                                            ArrayList<String> teamnameList = eventAffiliation.getTeamArray();
                                            for (int m = 0; m < teamnameList.size() - 1; m++) {
                                                teamTemp += teamnameList.get(m) + " | ";
                                                eventTeamsHM.put(teamnameList.get(m), teamnameList.get(m));
                                            }
                                            teamTemp += teamnameList.get(teamnameList.size() - 1);
                                            eventTeamsHM.put(teamnameList.get(teamnameList.size() - 1), teamnameList.get(teamnameList.size() - 1));
                                            jsonContactObj.addProperty("team", teamTemp);
                                        } else {
                                            jsonContactObj.addProperty("team", "");
                                        }

                                        if (eventRoleAssignmentList != null) {
                                            //boolean canJoinDisable = false;
                                            if (eventRoleAssignmentList.size() != 0) {

                                                for (EventRoleAssignment eventRoleAssignment : eventRoleAssignmentList) {
                                                    EventParticipant eventParticipant = EventParticipantDAO.retrieveParticipantbyRoleIDContactID(eventRoleAssignment.getRoleId(), contact.getContactId());
                                                    JsonObject roleJson = new JsonObject();
                                                    roleJson.addProperty("event_role_id", eventRoleAssignment.getRoleId());
                                                    roleJson.addProperty("event_role", eventRoleAssignment.getRoleName());
                                                    roleJson.addProperty("event_desc", eventRoleAssignment.getRoleDescription());
                                                    if (eventParticipant == null) {
                                                        roleJson.addProperty("joined", false);
                                                    } else if (eventParticipant.isPullout()) {
                                                        roleJson.addProperty("joined", false);
                                                    } else {
                                                        roleJson.addProperty("joined", true);
                                                        //canJoinDisable = true;
                                                    }
                                                    JsonArray roleParticipentArray = new JsonArray();
                                                    int roleId = eventRoleAssignment.getRoleId();
                                                    for (EventParticipant eventParticipantTemp : eventParticipantList) {
                                                        JsonObject role = new JsonObject();
                                                        if (roleId == eventParticipantTemp.getRoleID()) {
                                                            if (!eventParticipantTemp.isPullout()) {
                                                                int participantID = eventParticipantTemp.getContactID();
                                                                Contact contactTemp = cDAO.retrieveContactById(participantID);
                                                                role.addProperty("role_id", eventRoleAssignment.getRoleId());
                                                                role.addProperty("contact_id", contactTemp.getContactId());
                                                                if (contact.isIsAdmin() || RoleCheckDAO.checkRole(contact.getContactId(), "teammanager") || Validator.validEventLeaderPosition(contact.getContactId(), event.getEventId())) {
                                                                    role.addProperty("participant_name", (contactTemp.getName() + "(" + contactTemp.getUsername() + ")"));
                                                                    role.addProperty("canAppreciate", true);
                                                                } else {
                                                                    role.addProperty("participant_name", (contactTemp.getName()));
                                                                    role.addProperty("canAppreciate", false);
                                                                }
                                                                if(contact.isIsAdmin() || RoleCheckDAO.checkRole(contact.getContactId(), "teammanager") || contactTemp.getContactId() == contact.getContactId()){
                                                                    role.addProperty("canRemark", true);
                                                                }else{
                                                                    role.addProperty("canRemark", false);
                                                                }
                                                                //EventParticipant eventParticipantTemp = EventParticipantDAO.retrieveParticipantbyEventIDContactID(eventRoleAssignment.getRoleId(), contactTemp.getContactId());
                                                                if(eventParticipantTemp != null && eventParticipantTemp.getRemarks() != null){
                                                                    role.addProperty("remarks", eventParticipantTemp.getRemarks());
                                                                }else{
                                                                    role.addProperty("remarks", "");
                                                                }
                                                                if(eventParticipantTemp != null && eventParticipantTemp.getService_comment() != null){
                                                                    role.addProperty("eventParticipantservice_comment", eventParticipantTemp.getService_comment());
                                                                }else{
                                                                    role.addProperty("eventParticipantservice_comment", "");
                                                                }
                                                                
                                                                if(eventParticipantTemp != null && eventParticipantTemp.getService_comment() != null){
                                                                    role.addProperty("award_hours", eventParticipantTemp.getHoursServed());
                                                                }else{
                                                                    role.addProperty("award_hours", "");
                                                                }
                                                                
                                                                roleParticipentArray.add(role);
                                                            }
                                                        }
                                                    }
                                                    roleJson.add("event_participant", roleParticipentArray);
                                                    eventRoleJsonArray.add(roleJson);
                                                }
                                            }
                                            jsonContactObj.add("roles", eventRoleJsonArray);
                                        } else {
                                            jsonContactObj.addProperty("roles", "");
                                        }
                                        
                                        int partNumber = 0;
                                        for (EventParticipant eventParticipant : eventParticipantList) {
                                            if (!eventParticipant.isPullout()) {
                                                partNumber++;
                                            }
                                        }
                                        if (eventParticipantList == null) {
                                            jsonContactObj.addProperty("totalParticipant", partNumber);
                                        } else {
                                            jsonContactObj.addProperty("totalParticipant", partNumber);
                                        }
                                        jsonContactObj.addProperty("createdBy", event.getCreatedBy());
                                        if (teamNameFilter.isEmpty()) {
                                            eventArray.add(jsonContactObj);
                                        } else if (!teamNameFilter.isEmpty() && teamNameFilter.equals("my_team")) {
                                            Iterator iter = eventTeamsHM.keySet().iterator();
                                            while (iter.hasNext()) {
                                                String eventTeam = (String) iter.next();
                                                Boolean matchTeam = false;
                                                if(hmTeamPermission.containsKey(eventTeam)){
                                                    if(hmTeamPermission.get(eventTeam) != null){
                                                        matchTeam = true;
                                                    }
                                                }
                                                if (matchTeam) {
                                                    eventArray.add(jsonContactObj);
                                                    break;
                                                    //hmTeamPermission.clear();
                                                }
                                            }
                                        } else if (!teamNameFilter.isEmpty() && eventTeamsHM.containsKey(teamNameFilter)) {
                                            eventArray.add(jsonContactObj);
                                            //hmTeamPermission.clear();
                                        }
                                    }
                                } catch (ParseException ex) {
                                    Logger.getLogger(RetrieveUpcomingParticipants.class.getName()).log(Level.SEVERE, null, ex);
                                }
                            }
                            json.add("event", eventArray);
                            out.println(gson.toJson(json));
                        } else {
                            json.addProperty("message", "Fail retrieve all participants for upcoming events");
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
