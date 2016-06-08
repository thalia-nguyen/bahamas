/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bahamas.dao;

import bahamas.entity.TeamJoin;
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
 * @author tan.si.hao
 */
public class TeamJoinDAO {

    public static ArrayList<TeamJoin> retrieveAllTeamJoin(String username) {

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        ArrayList<TeamJoin> teamJoinList;
        teamJoinList = new ArrayList<TeamJoin>();

        try {
            conn = ConnectionManager.getConnection();
            
            //how all teams with date obslete filter
            //stmt = conn.prepareStatement("SELECT TEAM_NAME, T.DATE_CREATED, T.CREATED_BY, T.EXPLAIN_IF_OTHER, SUBTEAM, DATE_OBSOLETE, T.REMARKS, PERMISSION FROM TEAM_JOIN T, CONTACT C WHERE T.CONTACT_ID = C.CONTACT_ID AND (T.DATE_OBSOLETE = '0000-00-00' OR T.DATE_OBSOLETE = '' OR T.DATE_OBSOLETE IS NULL) AND C.USERNAME = (?)");
            //show all teams without date obslete filter
            stmt = conn.prepareStatement("SELECT TEAM_NAME, T.DATE_CREATED, T.CREATED_BY, T.EXPLAIN_IF_OTHER, SUBTEAM, DATE_OBSOLETE, T.REMARKS, PERMISSION FROM TEAM_JOIN T, CONTACT C WHERE T.CONTACT_ID = C.CONTACT_ID AND C.USERNAME = (?)");
            stmt.setString(1, username);
            
            rs = stmt.executeQuery();
            while (rs.next()) {

                String teamName = rs.getString(1);
                Date dateCreated = sdf.parse(rs.getString(2));
                String createdBy = rs.getString(3);
                String explainIfOthers = rs.getString(4);
                String subTeam = rs.getString(5);
                String dateString = rs.getString(6);
                Date dateObsolete = null;
                if(dateString != null){
                    dateObsolete = sdf.parse(dateString);
                }
                String remarks = rs.getString(7);
                String permission = rs.getString(8);

                TeamJoin teamJoin = new TeamJoin(username, teamName, dateCreated, createdBy, explainIfOthers, subTeam, dateObsolete, remarks, permission);
                teamJoinList.add(teamJoin);
            }
            return teamJoinList;

        } catch (ParseException ex) {
            Logger.getLogger(TeamJoinDAO.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(TeamJoinDAO.class.getName()).log(Level.SEVERE, "Unable to retrieve TEAMJOIN from database data", ex);
            ex.printStackTrace();
        } finally {
            ConnectionManager.close(conn, stmt, rs);
        }

        return null;

    }

}