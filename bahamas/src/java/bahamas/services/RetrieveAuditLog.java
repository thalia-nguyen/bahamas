/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bahamas.services;

import bahamas.dao.AuditLogDAO;
import bahamas.dao.ContactDAO;
import bahamas.entity.AuditLog;
import bahamas.entity.Contact;
import bahamas.util.Authenticator;
import bahamas.util.Validator;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import is203.JWTException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
@WebServlet(name = "RetrieveAuditLog", urlPatterns = {"/retrieve.auditlog"})
public class RetrieveAuditLog extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, JWTException {
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
                String cidString = Validator.containsBlankField(jobject.get("cid"));
                SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd-MMM-yyyy HH:mm:ss");

                if ((token == null || token.isEmpty()) || (cidString == null || cidString.isEmpty()) ) {
                    json.addProperty("message", "fail");
                    out.println(gson.toJson(json));
                    return;
                }

                String username = Authenticator.verifyToken(token);
                if (username == null) {
                    json.addProperty("message", "invalid token");
                    out.println(gson.toJson(json));
                    return;
                } 
                
                ContactDAO contactDAO = new ContactDAO();
                Contact contact = contactDAO.retrieveContactByUsername(username);
                int cidTemp = Integer.parseInt(cidString);
                
                
                if (contact != null && cidTemp == contact.getContactId() && contact.isIsAdmin()){
                    AuditLogDAO.insertAuditLog(contact.getUsername(), "AUDIT LOG", "Access into audit log");
                    ArrayList<AuditLog> AuditLogList = AuditLogDAO.retrieveAllAuditLog();
                    json.addProperty("message", "success");
                    
                    JsonArray auditArray = new JsonArray();
                    JsonObject jsonAuditObj;
                    
                    for (AuditLog a : AuditLogList) {
                        
                        
                        jsonAuditObj = new JsonObject();
                        jsonAuditObj.addProperty("date", sdf.format(a.getOperationDate()));
                        jsonAuditObj.addProperty("username", a.getUsername());
                        jsonAuditObj.addProperty("operation", a.getOperation());
                        auditArray.add(jsonAuditObj);
                        
                    }
                    json.add("auditlog", auditArray);
                    out.println(gson.toJson(json));
                    return;
                    
                }else{
                    json.addProperty("message", "failure retrieve from system");
                    out.println(gson.toJson(json));
                    return;
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
        try {
            processRequest(request, response);
        } catch (JWTException ex) {
            Logger.getLogger(RetrieveAuditLog.class.getName()).log(Level.SEVERE, null, ex);
        }
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
        try {
            processRequest(request, response);
        } catch (JWTException ex) {
            Logger.getLogger(RetrieveAuditLog.class.getName()).log(Level.SEVERE, null, ex);
        }
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
