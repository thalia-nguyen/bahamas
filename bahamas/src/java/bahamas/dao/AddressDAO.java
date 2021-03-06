/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bahamas.dao;

import bahamas.entity.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author HUXLEY
 */
public class AddressDAO {

    public static boolean addAddress(Address a) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        int result = 0;

        try {
            //get database connection
            conn = ConnectionManager.getConnection();
            stmt = conn.prepareStatement("INSERT INTO ADDRESS (CONTACT_ID,"
                    + "DATE_CREATED,CREATED_BY,ADDRESS,COUNTRY,ZIPCODE,REMARKS,DATE_OBSOLETE)"
                    + " VALUES (?,?,?,?,?,?,?,?)");

            stmt.setInt(1, a.getContact().getContactId());
            stmt.setTimestamp(2, new java.sql.Timestamp(a.getDateCreated().getTime()));
            stmt.setString(3, a.getCreatedBy());
            stmt.setString(4, a.getAddress());
            stmt.setString(5, a.getCountry());
            stmt.setString(6, a.getZipcode());
            stmt.setString(7, a.getRemarks());

            if (a.getDateObsolete() != null) {
                stmt.setDate(8, new java.sql.Date(a.getDateObsolete().getTime()));
            } else {
                stmt.setDate(8, null);
            }

            result = stmt.executeUpdate();

            return result == 1;

        } catch (SQLException ex) {
            ex.printStackTrace();
        } finally {
            ConnectionManager.close(conn, stmt, rs);
        }
        return false;
    }

    public static ArrayList<Address> retrieveAllAddress(Contact contact) {
        ArrayList<Address> addressList = new ArrayList<Address>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        int cid = contact.getContactId();
        SimpleDateFormat datetime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd");

        try {
            conn = ConnectionManager.getConnection();
            stmt = conn.prepareStatement("SELECT ZIPCODE, ADDRESS, COUNTRY, REMARKS, CREATED_BY, DATE_OBSOLETE, DATE_CREATED FROM ADDRESS WHERE CONTACT_ID = (?) ORDER BY DATE_CREATED DESC");
            stmt.setString(1, Integer.toString(cid));
            rs = stmt.executeQuery();
            while (rs.next()) {

                String zipcode = rs.getString(1);
                String address = rs.getString(2);
                String country = rs.getString(3);
                String remarks = rs.getString(4);
                String createdBy = rs.getString(5);
                String dateobs = rs.getString(6);
                Date dateObsolete = null;
                if (dateobs != null && !dateobs.isEmpty()) {
                    dateObsolete = date.parse(dateobs);
                }
                String dateStr = rs.getString(7);
                Date dateCreated = datetime.parse(dateStr);

                Address a = new Address(zipcode, address, country, remarks, createdBy, dateObsolete, dateCreated);

                addressList.add(a);
            }

        } catch (ParseException e) {
            e.printStackTrace();
        } catch (SQLException ex) {
            Logger.getLogger(RoleCheckDAO.class.getName()).log(Level.SEVERE, "Unable to retrieve ADDRESS from database", ex);
            ex.printStackTrace();
        } finally {
            ConnectionManager.close(conn, stmt, rs);
        }

        return addressList;

    }
    
    public static ArrayList<Address> retrieveAllAddress() {
        ArrayList<Address> addressList = new ArrayList<Address>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        SimpleDateFormat datetime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd");

        try {
            conn = ConnectionManager.getConnection();
            stmt = conn.prepareStatement("SELECT CONTACT_ID, ZIPCODE, ADDRESS, COUNTRY, REMARKS, CREATED_BY, DATE_OBSOLETE, DATE_CREATED FROM ADDRESS");
            rs = stmt.executeQuery();
            while (rs.next()) {
                int cid = rs.getInt(1);
                String zipcode = rs.getString(2);
                String address = rs.getString(3);
                String country = rs.getString(4);
                String remarks = rs.getString(5);
                String createdBy = rs.getString(6);
                String dateobs = rs.getString(7);
                Date dateObsolete = null;
                if (dateobs != null && !dateobs.isEmpty()) {
                    dateObsolete = date.parse(dateobs);
                }
                String dateStr = rs.getString(8);
                Date dateCreated = datetime.parse(dateStr);

                Address a = new Address(cid, zipcode, address, country, remarks, createdBy, dateObsolete, dateCreated);

                addressList.add(a);
            }

        } catch (ParseException e) {
            e.printStackTrace();
        } catch (SQLException ex) {
            Logger.getLogger(RoleCheckDAO.class.getName()).log(Level.SEVERE, "Unable to retrieve ADDRESS from database", ex);
            ex.printStackTrace();
        } finally {
            ConnectionManager.close(conn, stmt, rs);
        }

        return addressList;

    }


    public static boolean updateAddress(Address a) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        int result = 0;

        try {
            //get database connection
            conn = ConnectionManager.getConnection();
            stmt = conn.prepareStatement("UPDATE ADDRESS SET COUNTRY=?,"
                    + "ZIPCODE=?,REMARKS=?,DATE_OBSOLETE=? WHERE CONTACT_ID=? AND ADDRESS=?");

            stmt.setString(1, a.getCountry());
            stmt.setString(2, a.getZipcode());
            stmt.setString(3, a.getRemarks());

            if (a.getDateObsolete() != null) {
                stmt.setDate(4, new java.sql.Date(a.getDateObsolete().getTime()));
            } else {
                stmt.setDate(4, null);
            }

            stmt.setInt(5, a.getContact().getContactId());
            stmt.setString(6, a.getAddress());

            result = stmt.executeUpdate();

            return result == 1;

        } catch (SQLException ex) {
            ex.printStackTrace();
        } finally {
            ConnectionManager.close(conn, stmt, rs);
        }
        return false;
    }

    public static boolean deleteAddress(int cid,String address) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        int result = 0;

        try {
            //get database connection
            conn = ConnectionManager.getConnection();
            stmt = conn.prepareStatement("DELETE FROM ADDRESS "
                    + "WHERE CONTACT_ID=? AND ADDRESS=?");
        
            stmt.setInt(1, cid);
            stmt.setString(2,address);

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
