/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bahamas.dao.list;

import bahamas.dao.ConnectionManager;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Darryl Mok
 */
public class EventClassListDAO {
    private ArrayList<String> eventClassList;
    

    public EventClassListDAO() {
    }
    
    public ArrayList<String> retrieveEventClassList() {
        
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        eventClassList = new ArrayList<String>();

        try {
            conn = ConnectionManager.getConnection();
            stmt = conn.prepareStatement("SELECT * FROM EVENT_CLASS_LIST ORDER BY POSITION_NUMBER ASC");

            rs = stmt.executeQuery();
            while (rs.next()) {
                eventClassList.add(rs.getString(1));
            }

        } catch (SQLException ex) {
            Logger.getLogger(EventClassListDAO.class.getName()).log(Level.SEVERE, "Unable to retrieve Event Class list from database data", ex);
            ex.printStackTrace();
        } finally {
            ConnectionManager.close(conn, stmt, rs);
        }
        return eventClassList;
    }
}
