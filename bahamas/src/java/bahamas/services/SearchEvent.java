package bahamas.services;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import bahamas.dao.ContactDAO;
import bahamas.dao.RoleCheckDAO;
import bahamas.dao.SearchEventDAO;
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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
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
@WebServlet(urlPatterns = {"/event.search"})
public class SearchEvent extends HttpServlet {

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
                String eventTitle = Validator.containsBlankField(jobject.get("event_title"));
                String event_location = Validator.containsBlankField(jobject.get("event_location"));
                Date startDateStr = Validator.isDateValid(jobject.get("start_date"), "start_date");
                Date endDateStr = Validator.isDateValid(jobject.get("end_date"), "end_date");
                String teamAffiliation = Validator.containsBlankField(jobject.get("team_affiliation"));
                String participant = Validator.containsBlankField(jobject.get("participant"));
                boolean otherLocation = jobject.get("is_other_location").getAsBoolean();

                String username = Authenticator.verifyToken(token);
                if (username == null) {
                    json.addProperty("message", "invalid token");
                    out.println(gson.toJson(json));
                } else {
                    ContactDAO cDAO = new ContactDAO();
                    Contact contact = cDAO.retrieveContactByUsername(username);
                    SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd");
                    if (contact.isIsAdmin() || RoleCheckDAO.checkRole(contact.getContactId(), "teammanager")) {
                        HashMap<Integer, Event> eventHM = null;
                        try {
                            if (eventTitle != null || event_location != null || startDateStr != null || endDateStr != null) {
                                if (!otherLocation) {
                                    if (startDateStr != null && endDateStr != null) {
                                        eventHM = SearchEventDAO.searchEventByTitleLocationDate(eventTitle, event_location, date.parse(date.format(startDateStr)), date.parse(date.format(endDateStr)));
                                    } else {
                                        eventHM = SearchEventDAO.searchEventByTitleLocationDate(eventTitle, event_location, null, null);
                                    }
                                } else {
                                    if (startDateStr != null && endDateStr != null) {
                                        eventHM = SearchEventDAO.searchEventByTitleOtherlocationDate(eventTitle, event_location, date.parse(date.format(startDateStr)), date.parse(date.format(endDateStr)));
                                    } else {
                                        eventHM = SearchEventDAO.searchEventByTitleOtherlocationDate(eventTitle, event_location, null, null);
                                    }
                                }
                            }

                            if (eventHM == null && teamAffiliation != null) {
                                eventHM = SearchEventDAO.searchEventByTeam(teamAffiliation);
                            } else if (eventHM != null && teamAffiliation != null) {
                                HashMap<Integer, Event> tempHM = SearchEventDAO.searchEventByTeam(teamAffiliation);
                                eventHM.keySet().retainAll(tempHM.keySet());
                            }

                            if (eventHM == null && participant != null) {
                                eventHM = SearchEventDAO.searchEventByParticipant(participant);
                            } else if (eventHM != null && participant != null) {
                                HashMap<Integer, Event> tempHM = SearchEventDAO.searchEventByParticipant(participant);
                                eventHM.keySet().retainAll(tempHM.keySet());
                            }

                            json.addProperty("message", "success");
                            JsonArray eventtArray = new JsonArray();
                            JsonObject jsonEventObj;
                            for (int tempEventId : eventHM.keySet()) {
                                Event tempEvent = eventHM.get(tempEventId);
                                jsonEventObj = new JsonObject();
                                jsonEventObj.addProperty("eventid", tempEvent.getEventId());
                                jsonEventObj.addProperty("event_title", tempEvent.getEventTitle());
                                eventtArray.add(jsonEventObj);
                            }

                            json.add("event", eventtArray);
                            out.println(gson.toJson(json));

                        } catch (ParseException ex) {
                            Logger.getLogger(SearchEvent.class.getName()).log(Level.SEVERE, null, ex);
                            json.addProperty("message", "fail");
                            out.println(gson.toJson(json));
                        }

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