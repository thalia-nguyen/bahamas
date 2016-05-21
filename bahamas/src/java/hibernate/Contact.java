package hibernate;
// Generated 21 May, 2016 5:04:19 PM by Hibernate Tools 4.3.1


import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Contact generated by hbm2java
 */
public class Contact  implements java.io.Serializable {


     private int contactId;
     private TypeOfContactList typeOfContactList;
     private String username;
     private String password;
     private String isadmin;
     private String deactivated;
     private Date dateCreated;
     private String createdBy;
     private String name;
     private String altName;
     private String explainIfOther;
     private String profession;
     private String jobTitle;
     private String nricFin;
     private String gender;
     private String nationality;
     private Date dateOfBirth;
     private String profilePic;
     private String remarks;
     private String notification;
     private Set<TeamJoin> teamJoins = new HashSet<TeamJoin>(0);
     private Set<LanguageAssignment> languageAssignments = new HashSet<LanguageAssignment>(0);
     private Set<Email> emails = new HashSet<Email>(0);
     private Set<Membership> memberships = new HashSet<Membership>(0);
     private Set<OfficeHeld> officeHelds = new HashSet<OfficeHeld>(0);
     private Set<Donation> donations = new HashSet<Donation>(0);
     private Set<Phone> phones = new HashSet<Phone>(0);
     private Set<Address> addresses = new HashSet<Address>(0);
     private Set<SkillAssignment> skillAssignments = new HashSet<SkillAssignment>(0);
     private Set<Proxy> proxiesForProxyId = new HashSet<Proxy>(0);
     private Set<Appreciation> appreciations = new HashSet<Appreciation>(0);
     private Set<Proxy> proxiesForContactId = new HashSet<Proxy>(0);
     private Set<EventParticipant> eventParticipantsForAwarderId = new HashSet<EventParticipant>(0);
     private Set<TrainingCertificated> trainingCertificateds = new HashSet<TrainingCertificated>(0);
     private Set<EventParticipant> eventParticipantsForContactId = new HashSet<EventParticipant>(0);

    public Contact() {
    }

	
    public Contact(int contactId, String createdBy) {
        this.contactId = contactId;
        this.createdBy = createdBy;
    }
    public Contact(int contactId, TypeOfContactList typeOfContactList, String username, String password, String isadmin, String deactivated, Date dateCreated, String createdBy, String name, String altName, String explainIfOther, String profession, String jobTitle, String nricFin, String gender, String nationality, Date dateOfBirth, String profilePic, String remarks, String notification, Set<TeamJoin> teamJoins, Set<LanguageAssignment> languageAssignments, Set<Email> emails, Set<Membership> memberships, Set<OfficeHeld> officeHelds, Set<Donation> donations, Set<Phone> phones, Set<Address> addresses, Set<SkillAssignment> skillAssignments, Set<Proxy> proxiesForProxyId, Set<Appreciation> appreciations, Set<Proxy> proxiesForContactId, Set<EventParticipant> eventParticipantsForAwarderId, Set<TrainingCertificated> trainingCertificateds, Set<EventParticipant> eventParticipantsForContactId) {
       this.contactId = contactId;
       this.typeOfContactList = typeOfContactList;
       this.username = username;
       this.password = password;
       this.isadmin = isadmin;
       this.deactivated = deactivated;
       this.dateCreated = dateCreated;
       this.createdBy = createdBy;
       this.name = name;
       this.altName = altName;
       this.explainIfOther = explainIfOther;
       this.profession = profession;
       this.jobTitle = jobTitle;
       this.nricFin = nricFin;
       this.gender = gender;
       this.nationality = nationality;
       this.dateOfBirth = dateOfBirth;
       this.profilePic = profilePic;
       this.remarks = remarks;
       this.notification = notification;
       this.teamJoins = teamJoins;
       this.languageAssignments = languageAssignments;
       this.emails = emails;
       this.memberships = memberships;
       this.officeHelds = officeHelds;
       this.donations = donations;
       this.phones = phones;
       this.addresses = addresses;
       this.skillAssignments = skillAssignments;
       this.proxiesForProxyId = proxiesForProxyId;
       this.appreciations = appreciations;
       this.proxiesForContactId = proxiesForContactId;
       this.eventParticipantsForAwarderId = eventParticipantsForAwarderId;
       this.trainingCertificateds = trainingCertificateds;
       this.eventParticipantsForContactId = eventParticipantsForContactId;
    }
   
    public int getContactId() {
        return this.contactId;
    }
    
    public void setContactId(int contactId) {
        this.contactId = contactId;
    }
    public TypeOfContactList getTypeOfContactList() {
        return this.typeOfContactList;
    }
    
    public void setTypeOfContactList(TypeOfContactList typeOfContactList) {
        this.typeOfContactList = typeOfContactList;
    }
    public String getUsername() {
        return this.username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return this.password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    public String getIsadmin() {
        return this.isadmin;
    }
    
    public void setIsadmin(String isadmin) {
        this.isadmin = isadmin;
    }
    public String getDeactivated() {
        return this.deactivated;
    }
    
    public void setDeactivated(String deactivated) {
        this.deactivated = deactivated;
    }
    public Date getDateCreated() {
        return this.dateCreated;
    }
    
    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }
    public String getCreatedBy() {
        return this.createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    public String getAltName() {
        return this.altName;
    }
    
    public void setAltName(String altName) {
        this.altName = altName;
    }
    public String getExplainIfOther() {
        return this.explainIfOther;
    }
    
    public void setExplainIfOther(String explainIfOther) {
        this.explainIfOther = explainIfOther;
    }
    public String getProfession() {
        return this.profession;
    }
    
    public void setProfession(String profession) {
        this.profession = profession;
    }
    public String getJobTitle() {
        return this.jobTitle;
    }
    
    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }
    public String getNricFin() {
        return this.nricFin;
    }
    
    public void setNricFin(String nricFin) {
        this.nricFin = nricFin;
    }
    public String getGender() {
        return this.gender;
    }
    
    public void setGender(String gender) {
        this.gender = gender;
    }
    public String getNationality() {
        return this.nationality;
    }
    
    public void setNationality(String nationality) {
        this.nationality = nationality;
    }
    public Date getDateOfBirth() {
        return this.dateOfBirth;
    }
    
    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    public String getProfilePic() {
        return this.profilePic;
    }
    
    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }
    public String getRemarks() {
        return this.remarks;
    }
    
    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
    public String getNotification() {
        return this.notification;
    }
    
    public void setNotification(String notification) {
        this.notification = notification;
    }
    public Set<TeamJoin> getTeamJoins() {
        return this.teamJoins;
    }
    
    public void setTeamJoins(Set<TeamJoin> teamJoins) {
        this.teamJoins = teamJoins;
    }
    public Set<LanguageAssignment> getLanguageAssignments() {
        return this.languageAssignments;
    }
    
    public void setLanguageAssignments(Set<LanguageAssignment> languageAssignments) {
        this.languageAssignments = languageAssignments;
    }
    public Set<Email> getEmails() {
        return this.emails;
    }
    
    public void setEmails(Set<Email> emails) {
        this.emails = emails;
    }
    public Set<Membership> getMemberships() {
        return this.memberships;
    }
    
    public void setMemberships(Set<Membership> memberships) {
        this.memberships = memberships;
    }
    public Set<OfficeHeld> getOfficeHelds() {
        return this.officeHelds;
    }
    
    public void setOfficeHelds(Set<OfficeHeld> officeHelds) {
        this.officeHelds = officeHelds;
    }
    public Set<Donation> getDonations() {
        return this.donations;
    }
    
    public void setDonations(Set<Donation> donations) {
        this.donations = donations;
    }
    public Set<Phone> getPhones() {
        return this.phones;
    }
    
    public void setPhones(Set<Phone> phones) {
        this.phones = phones;
    }
    public Set<Address> getAddresses() {
        return this.addresses;
    }
    
    public void setAddresses(Set<Address> addresses) {
        this.addresses = addresses;
    }
    public Set<SkillAssignment> getSkillAssignments() {
        return this.skillAssignments;
    }
    
    public void setSkillAssignments(Set<SkillAssignment> skillAssignments) {
        this.skillAssignments = skillAssignments;
    }
    public Set<Proxy> getProxiesForProxyId() {
        return this.proxiesForProxyId;
    }
    
    public void setProxiesForProxyId(Set<Proxy> proxiesForProxyId) {
        this.proxiesForProxyId = proxiesForProxyId;
    }
    public Set<Appreciation> getAppreciations() {
        return this.appreciations;
    }
    
    public void setAppreciations(Set<Appreciation> appreciations) {
        this.appreciations = appreciations;
    }
    public Set<Proxy> getProxiesForContactId() {
        return this.proxiesForContactId;
    }
    
    public void setProxiesForContactId(Set<Proxy> proxiesForContactId) {
        this.proxiesForContactId = proxiesForContactId;
    }
    public Set<EventParticipant> getEventParticipantsForAwarderId() {
        return this.eventParticipantsForAwarderId;
    }
    
    public void setEventParticipantsForAwarderId(Set<EventParticipant> eventParticipantsForAwarderId) {
        this.eventParticipantsForAwarderId = eventParticipantsForAwarderId;
    }
    public Set<TrainingCertificated> getTrainingCertificateds() {
        return this.trainingCertificateds;
    }
    
    public void setTrainingCertificateds(Set<TrainingCertificated> trainingCertificateds) {
        this.trainingCertificateds = trainingCertificateds;
    }
    public Set<EventParticipant> getEventParticipantsForContactId() {
        return this.eventParticipantsForContactId;
    }
    
    public void setEventParticipantsForContactId(Set<EventParticipant> eventParticipantsForContactId) {
        this.eventParticipantsForContactId = eventParticipantsForContactId;
    }




}


