/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bahamas.services;

import bahamas.dao.AuditLogDAO;
import bahamas.dao.ContactDAO;
import bahamas.entity.Contact;
import bahamas.util.Authenticator;
import bahamas.util.Validator;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;
import java.util.UUID;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author HUXLEY
 */
@WebServlet(name = "DeleteImage", urlPatterns = {"/image.delete"})
@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 2, // 2MB
        maxFileSize = 1024 * 1024 * 2, // 
        maxRequestSize = 1024 * 1024 * 10)   // 
public class DeleteImage extends HttpServlet {

    private static final String SAVE_DIR = "images";

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
                json.addProperty("message", "fail");
                out.println(gson.toJson(json));

            } else {
                //Parse json object
                JsonElement jelement = new JsonParser().parse(jsonLine);
                JsonObject jobject = jelement.getAsJsonObject();

                String token = Validator.containsBlankField(jobject.get("token"));

                if (token != null) {
                    ContactDAO cDAO = new ContactDAO();
                    String username = Authenticator.verifyToken(token);
                    if (username != null) {

                        Contact contact = cDAO.retrieveContactByUsername(username);

                        if (!contact.isIsAdmin()) {
                            json.addProperty("message", "Image failed to delete, unauthorized!");
                            out.println(gson.toJson(json));
                            return;
                        }

                        // gets absolute path of the web application
                        String appPath = request.getServletContext().getRealPath("");
                        // constructs path of the directory to save uploaded file
                        String savePath = appPath + File.separator + SAVE_DIR;

                        // creates the save directory if it does not exists
                        File fileSaveDir = new File(savePath);
                        if (!fileSaveDir.exists()) {
                            fileSaveDir.mkdir();
                        }

                        int contactId = Validator.isIntValid(jobject.get("contact_id"));
                        String uniqueId = UUID.randomUUID().toString().replaceAll("-", "");
                        //request.getPart("image").write(savePath + File.separator + username + ".jpg");
                        try {

                            Contact c = cDAO.retrieveContactById(contactId);

                            if (c != null) {

                                Files.copy(new File(savePath + File.separator + "default" + ".jpg").toPath(),
                                        new File(savePath + File.separator + uniqueId + ".jpg").toPath(), REPLACE_EXISTING);

                                String oldImage = ContactDAO.updateImage(c.getUsername(), "./" + SAVE_DIR + "/" + uniqueId + ".jpg");

                                if (oldImage != null && !oldImage.isEmpty()) {
                                    Files.deleteIfExists(Paths.get(savePath + File.separator + oldImage.substring(8)));
                                }

                                AuditLogDAO.insertAuditLog(username, "DELETE RPOFILE PICTURE", "DELETE PROFILE PICTURE under contact: Contact ID: " + c.getContactId());

                            } else {
                                json.addProperty("message", "Image failed to delete!");
                                out.println(gson.toJson(json));
                                return;
                            }

                        } catch (Exception e) {
                            json.addProperty("message", "Image failed to delete!");
                            out.println(gson.toJson(json));
                            return;
                        }

                        json.addProperty("message", "Image successfully deleted!");
                        json.addProperty("image", "./" + SAVE_DIR + "/" + uniqueId + ".jpg");
                        out.println(gson.toJson(json));

                        return;
                    }
                }
                json.addProperty("message", "Image failed to delete!");
                out.println(gson.toJson(json));
                return;
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
