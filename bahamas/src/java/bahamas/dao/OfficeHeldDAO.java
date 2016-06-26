/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bahamas.dao;

import bahamas.entity.OfficeHeld;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author HUXLEY
 */
public class OfficeHeldDAO {

    public static boolean addOfficeHeld(OfficeHeld o) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        int result = 0;

        try {
            //get database connection
            conn = ConnectionManager.getConnection();
            stmt = conn.prepareStatement("INSERT INTO OFFICE_HELD (CONTACT_ID,"
                    + "DATE_CREATED,CREATED_BY,START_OFFICE,END_OFFICE,OFFICE_HELD_NAME,REMARKS)"
                    + " VALUES (?,?,?,?,?,?,?)");

            stmt.setInt(1, o.getContact().getContactId());
            stmt.setTimestamp(2, new java.sql.Timestamp(o.getDateCreated().getTime()));
            stmt.setString(3, o.getCreatedBy());

            if (o.getStartOffice() != null) {
                stmt.setDate(4, new java.sql.Date(o.getStartOffice().getTime()));
            } else {
                stmt.setDate(4, null);
            }

            if (o.getEndOffice() != null) {
                stmt.setDate(5, new java.sql.Date(o.getEndOffice().getTime()));
            } else {
                stmt.setDate(5, null);
            }

            stmt.setString(6, o.getOfficeHeldPosition());
            stmt.setString(7, o.getRemarks());

            result = stmt.executeUpdate();

            return result == 1;

        } catch (SQLException ex) {
            ex.printStackTrace();
        } finally {
            ConnectionManager.close(conn, stmt, rs);
        }
        return false;
    }

    public static ArrayList<OfficeHeld> retrieveOfficeHeldByCID(int cid) {

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        ArrayList<OfficeHeld> officeHeldList;
        officeHeldList = new ArrayList<OfficeHeld>();

        try {
            conn = ConnectionManager.getConnection();
            stmt = conn.prepareStatement("SELECT START_OFFICE, END_OFFICE, REMARKS, DATE_CREATED, CREATED_BY, OFFICE_HELD_NAME FROM OFFICE_HELD WHERE CONTACT_ID = (?) ");
            stmt.setInt(1, cid);

            rs = stmt.executeQuery();
            while (rs.next()) {

                Date startOffice = rs.getDate(1);
                Date endOffice = rs.getDate(2);
                String remarks = rs.getString(3);
                Date dateCreated = rs.getTimestamp(4);
                String createdBy = rs.getString(5);
                String officeHeldPosition = rs.getString(6);

                OfficeHeld officeHeld = new OfficeHeld(startOffice, endOffice, remarks, dateCreated, createdBy, officeHeldPosition);
                officeHeldList.add(officeHeld);
            }

        } catch (SQLException ex) {
            Logger.getLogger(MembershipDAO.class.getName()).log(Level.SEVERE, "Unable to retrieve OFFICE_HELD from database", ex);
            ex.printStackTrace();
        } finally {
            ConnectionManager.close(conn, stmt, rs);
        }
        return officeHeldList;
    }

    public static boolean updateOfficeHeld(OfficeHeld o) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        int result = 0;

        try {
            //get database connection
            conn = ConnectionManager.getConnection();
            stmt = conn.prepareStatement("UPDATE OFFICE_HELD SET START_OFFICE=?,END_OFFICE=?,REMARKS=? "
                    + "WHERE CONTACT_ID AND OFFICE_HELD_NAME=?");

            if (o.getStartOffice() != null) {
                stmt.setDate(1, new java.sql.Date(o.getStartOffice().getTime()));
            } else {
                stmt.setDate(1, null);
            }

            if (o.getEndOffice() != null) {
                stmt.setDate(2, new java.sql.Date(o.getEndOffice().getTime()));
            } else {
                stmt.setDate(2, null);
            }
            stmt.setString(3, o.getRemarks());
            stmt.setInt(4, o.getContact().getContactId());
            stmt.setString(5, o.getOfficeHeldPosition());

            result = stmt.executeUpdate();

            return result == 1;

        } catch (SQLException ex) {
            ex.printStackTrace();
        } finally {
            ConnectionManager.close(conn, stmt, rs);
        }
        return false;
    }

    public static boolean deleteOfficeHeld(int id, String officeName) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        int result = 0;

        try {
            //get database connection
            conn = ConnectionManager.getConnection();
            stmt = conn.prepareStatement("DELETE FROM OFFICE_HELD "
                    + "WHERE CONTACT_ID AND OFFICE_HELD_NAME=?");

            stmt.setInt(1, id);
            stmt.setString(2, officeName);

            result = stmt.executeUpdate();

            return result == 1;

        } catch (SQLException ex) {
            ex.printStackTrace();
        } finally {
            ConnectionManager.close(conn, stmt, rs);
        }
        return false;

    }

}
