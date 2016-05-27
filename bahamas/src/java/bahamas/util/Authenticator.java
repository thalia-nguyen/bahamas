/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bahamas.util;

import is203.JWTUtility;
import java.io.InputStream;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author huxley.goh
 */
public class Authenticator {

    private static final String PROPS_FILENAME = "/secret.properties";

    public static String signedToken(String username) {
        String token = null;
        try {
            InputStream is = Authenticator.class.getResourceAsStream(PROPS_FILENAME);
            Properties props = new Properties();
            props.load(is);

            String key = props.getProperty("secret.key");
            token = JWTUtility.sign(key, username);

        } catch (Exception ex) {
            String message = "Unable to load '" + PROPS_FILENAME + "'.";

            System.out.println(message);
            Logger.getLogger(Authenticator.class.getName()).log(Level.SEVERE, message, ex);
            throw new RuntimeException(message, ex);

        } finally {
            return token;
        }
    }

    public static boolean verifyToken(String token) {
        String username = null;
        try {
            InputStream is = Authenticator.class.getResourceAsStream(PROPS_FILENAME);
            Properties props = new Properties();
            props.load(is);

            String key = props.getProperty("secret.key");
            username = JWTUtility.verify(token,key);
            
            if(username == null){
                return false;
            }
            else{
                return true;
            }

        } catch (Exception ex) {
            String message = "Unable to load '" + PROPS_FILENAME + "'.";

            System.out.println(message);
            Logger.getLogger(Authenticator.class.getName()).log(Level.SEVERE, message, ex);
            return false;
        }

    }

}
