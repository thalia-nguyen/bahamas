<%-- 
    Document   : protectuser
    Created on : 8 May, 2016, 3:22:13 PM
    Author     : Marcus
--%>
<%
    String userName = (String)session.getAttribute("user");
    if(!userName.equals("user")){
        response.sendRedirect("novice.jsp");
    }
    
%>
