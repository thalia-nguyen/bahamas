/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bahamas.entity;

import java.util.ArrayList;
import java.util.Date;

public class Contact {


    /*
     * To change this license header, choose License Headers in Project Properties.
     * To change this template file, choose Tools | Templates
     * and open the template in the editor.
     */
    private int contactId;
    private String contactType;
    private String username;
    private String password;
    private String salt;
    private boolean isAdmin;
    private boolean isNovice;
    private boolean deactivated;
    private boolean notification;
    private Date dateCreated = new java.util.Date();
    private String createdBy;
    private String name;
    private String altName;
    private String explainIfOther;
    private String profession;
    private String jobTitle;
    private String nric;
    private String gender;
    private String nationality;
    private Date dateOfBirth;
    private String profilePic;
    private String remarks;
    private String emailStrList;
    private String phoneStrList;
    private String sendEmailFormat;
    private Date lastLogin;

    public Date getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }

    private ArrayList<Phone> phoneList = new ArrayList<Phone>();
    private ArrayList<Address> addressList = new ArrayList<Address>();
    private ArrayList<Email> emailList = new ArrayList<Email>();
    private ArrayList<OfficeHeld> officeHeldList = new ArrayList<OfficeHeld>();
    private ArrayList<Proxy> proxyList = new ArrayList<Proxy>();
    private ArrayList<Membership> membershipList = new ArrayList<Membership>();
    private ArrayList<LanguageAssignment> languageAssignmentList = new ArrayList<LanguageAssignment>();
    private ArrayList<SkillAssignment> skillAssignmentList = new ArrayList<SkillAssignment>();
    private ArrayList<Appreciation> appreciationList = new ArrayList<Appreciation>();
    private ArrayList<Donation> donationList = new ArrayList<Donation>();

    private ArrayList<TeamJoin> teamJoinList = new ArrayList<TeamJoin>();

    // certification that a contact have
    private ArrayList<Training> certificationList = new ArrayList<Training>();
    // awarding certification to contacts
    private ArrayList<Training> certificationAwarderList = new ArrayList<Training>();

    public Contact() {
    }

    //Create contact object for adding new contact
    public Contact(String contactType, String createdBy, String name,
            String altName, String explainIfOther, String profession, String jobTitle,
            String nric, String gender, String nationality, Date dateOfBirth, String remarks) {
        this.contactType = contactType;
        this.createdBy = createdBy;
        this.name = name;
        this.altName = altName;
        this.explainIfOther = explainIfOther;
        this.profession = profession;
        this.jobTitle = jobTitle;
        this.nric = nric;
        this.gender = gender;
        this.nationality = nationality;
        this.dateOfBirth = dateOfBirth;
        this.remarks = remarks;

    }

    public Contact(int contactId, String contactType, String username,
            String password, String salt, boolean admin, boolean novice, boolean deactivated, Date dateCreated,
            String createdBy, String name, String altName, String explainIfOther,
            String profession, String jobTitle, String nric, String gender,
            String nationality, Date dateOfBirth, String profilePic, String remarks,
            boolean notification) {
        this.contactId = contactId;
        this.contactType = contactType;
        this.username = username;
        this.password = password;
        this.salt = salt;
        this.isAdmin = admin;
        this.isNovice = novice;
        this.deactivated = deactivated;
        this.dateCreated = dateCreated;
        this.createdBy = createdBy;
        this.name = name;
        this.altName = altName;
        this.explainIfOther = explainIfOther;
        this.profession = profession;
        this.jobTitle = jobTitle;
        this.nric = nric;
        this.gender = gender;
        this.nationality = nationality;
        this.dateOfBirth = dateOfBirth;
        this.profilePic = profilePic;
        this.remarks = remarks;
        this.notification = notification;
    }

    //Generated by contactDAO
    public Contact(int contactId, String contactType, String username,
            String password, String salt, boolean admin, boolean novice, boolean deactivated, Date dateCreated,
            String createdBy, String name, String altName, String explainIfOther,
            String profession, String jobTitle, String nric, String gender,
            String nationality, Date dateOfBirth, String profilePic, String remarks,
            boolean notification, String emailStrList, String phoneStrList, String sendEmailFormat, Date lastLogin) {
        this.contactId = contactId;
        this.contactType = contactType;
        this.username = username;
        this.password = password;
        this.salt = salt;
        this.isAdmin = admin;
        this.isNovice = novice;
        this.deactivated = deactivated;
        this.dateCreated = dateCreated;
        this.createdBy = createdBy;
        this.name = name;
        this.altName = altName;
        this.explainIfOther = explainIfOther;
        this.profession = profession;
        this.jobTitle = jobTitle;
        this.nric = nric;
        this.gender = gender;
        this.nationality = nationality;
        this.dateOfBirth = dateOfBirth;
        this.profilePic = profilePic;
        this.remarks = remarks;
        this.notification = notification;
        this.emailStrList = emailStrList;
        this.phoneStrList = phoneStrList;
        this.sendEmailFormat = sendEmailFormat;
        this.lastLogin = lastLogin;
    }

    //For UserManagement
    public Contact(int contactId, String contactType, String username,
            String password, String salt, boolean admin, boolean novice, boolean deactivated, Date dateCreated,
            String createdBy, String name, String altName, String explainIfOther,
            String profession, String jobTitle, String nric, String gender,
            String nationality, Date dateOfBirth, String profilePic, String remarks,
            boolean notification, Date lastLogin) {
        this.contactId = contactId;
        this.contactType = contactType;
        this.username = username;
        this.password = password;
        this.salt = salt;
        this.isAdmin = admin;
        this.isNovice = novice;
        this.deactivated = deactivated;
        this.dateCreated = dateCreated;
        this.createdBy = createdBy;
        this.name = name;
        this.altName = altName;
        this.explainIfOther = explainIfOther;
        this.profession = profession;
        this.jobTitle = jobTitle;
        this.nric = nric;
        this.gender = gender;
        this.nationality = nationality;
        this.dateOfBirth = dateOfBirth;
        this.profilePic = profilePic;
        this.remarks = remarks;
        this.notification = notification;
        this.lastLogin = lastLogin;
    }

    //for import contacts
    public Contact(String name, String altName, String contactType,
            String otherExplanation, String profession, String jobTitle, String nric,
            String gender, String nationality, Date dob, String remarks, boolean notification,
            String createdBy) {

        this.contactType = contactType;
        this.createdBy = createdBy;
        this.name = name;
        this.altName = altName;
        this.explainIfOther = otherExplanation;
        this.profession = profession;
        this.jobTitle = jobTitle;
        this.nric = nric;
        this.gender = gender;
        this.nationality = nationality;
        this.dateOfBirth = dob;
        this.remarks = remarks;
        this.notification = notification;

    }

    public int getContactId() {
        return contactId;
    }

    public void setContactId(int contactId) {
        this.contactId = contactId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public boolean isDeactivated() {
        return deactivated;
    }

    public void setDeactivated(boolean deactivated) {
        this.deactivated = deactivated;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAltName() {
        return altName;
    }

    public void setAltName(String altName) {
        this.altName = altName;
    }

    public String getExplainIfOther() {
        return explainIfOther;
    }

    public void setExplainIfOther(String explainIfOther) {
        this.explainIfOther = explainIfOther;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getNric() {
        return nric;
    }

    public void setNric(String nric) {
        this.nric = nric;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public boolean isIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public boolean isIsNovice() {
        return isNovice;
    }

    public void setIsNovice(boolean isNovice) {
        this.isNovice = isNovice;
    }

    public boolean isNotification() {
        return notification;
    }

    public void setNotification(boolean notification) {
        this.notification = notification;
    }

    public ArrayList<TeamJoin> getTeamJoinList() {
        return teamJoinList;
    }

    public void setTeamJoinList(ArrayList<TeamJoin> teamJoinList) {
        this.teamJoinList = teamJoinList;
    }

    public String getContactType() {
        return contactType;
    }

    public void setContactType(String contactType) {
        this.contactType = contactType;
    }

    public ArrayList<Phone> getPhoneList() {
        return phoneList;
    }

    public void setPhoneList(ArrayList<Phone> phoneList) {
        this.phoneList = phoneList;
    }

    public ArrayList<Address> getAddressList() {
        return addressList;
    }

    public void setAddressList(ArrayList<Address> addressList) {
        this.addressList = addressList;
    }

    public ArrayList<Email> getEmailList() {
        return emailList;
    }

    public void setEmailList(ArrayList<Email> emailList) {
        this.emailList = emailList;
    }

    public ArrayList<OfficeHeld> getOfficeHeldList() {
        return officeHeldList;
    }

    public void setOfficeHeldList(ArrayList<OfficeHeld> officeHeldList) {
        this.officeHeldList = officeHeldList;
    }

    public ArrayList<Proxy> getProxyList() {
        return proxyList;
    }

    public void setProxyList(ArrayList<Proxy> proxyList) {
        this.proxyList = proxyList;
    }

    public ArrayList<Membership> getMembershipList() {
        return membershipList;
    }

    public void setMembershipList(ArrayList<Membership> membershipList) {
        this.membershipList = membershipList;
    }

    public ArrayList<LanguageAssignment> getLanguageAssignmentList() {
        return languageAssignmentList;
    }

    public void setLanguageAssignmentList(ArrayList<LanguageAssignment> languageAssignmentList) {
        this.languageAssignmentList = languageAssignmentList;
    }

    public ArrayList<SkillAssignment> getSkillAssignmentList() {
        return skillAssignmentList;
    }

    public void setSkillAssignmentList(ArrayList<SkillAssignment> skillAssignmentList) {
        this.skillAssignmentList = skillAssignmentList;
    }

    public ArrayList<Appreciation> getAppreciationList() {
        return appreciationList;
    }

    public void setAppreciationList(ArrayList<Appreciation> appreciationList) {
        this.appreciationList = appreciationList;
    }

    public ArrayList<Donation> getDonationList() {
        return donationList;
    }

    public void setDonationList(ArrayList<Donation> donationList) {
        this.donationList = donationList;
    }

    public ArrayList<Training> getCertificationList() {
        return certificationList;
    }

    public void setCertificationList(ArrayList<Training> certificationList) {
        this.certificationList = certificationList;
    }

    public ArrayList<Training> getCertificationAwarderList() {
        return certificationAwarderList;
    }

    public void setCertificationAwarderList(ArrayList<Training> certificationAwarderList) {
        this.certificationAwarderList = certificationAwarderList;
    }

    public String getEmailStrList() {
        return emailStrList;
    }

    public void setEmailStrList(String emailStrList) {
        this.emailStrList = emailStrList;
    }

    public String getPhoneStrList() {
        return phoneStrList;
    }

    public void setPhoneStrList(String phoneStrList) {
        this.phoneStrList = phoneStrList;
    }

    public String getSendEmailFormat() {
        return sendEmailFormat;
    }

    public void setSendEmailFormat(String sendEmailFormat) {
        this.sendEmailFormat = sendEmailFormat;
    }

}
