package hibernate;
// Generated 21 May, 2016 5:04:19 PM by Hibernate Tools 4.3.1


import java.util.Date;

/**
 * Notice generated by hbm2java
 */
public class Notice  implements java.io.Serializable {


     private int noticeId;
     private Event event;
     private String createdBy;
     private Date dateCreated;
     private String activelyPushout;
     private String messageTitle;
     private String messageContent;
     private String status;

    public Notice() {
    }

	
    public Notice(int noticeId, Event event, String createdBy, Date dateCreated, String messageTitle) {
        this.noticeId = noticeId;
        this.event = event;
        this.createdBy = createdBy;
        this.dateCreated = dateCreated;
        this.messageTitle = messageTitle;
    }
    public Notice(int noticeId, Event event, String createdBy, Date dateCreated, String activelyPushout, String messageTitle, String messageContent, String status) {
       this.noticeId = noticeId;
       this.event = event;
       this.createdBy = createdBy;
       this.dateCreated = dateCreated;
       this.activelyPushout = activelyPushout;
       this.messageTitle = messageTitle;
       this.messageContent = messageContent;
       this.status = status;
    }
   
    public int getNoticeId() {
        return this.noticeId;
    }
    
    public void setNoticeId(int noticeId) {
        this.noticeId = noticeId;
    }
    public Event getEvent() {
        return this.event;
    }
    
    public void setEvent(Event event) {
        this.event = event;
    }
    public String getCreatedBy() {
        return this.createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    public Date getDateCreated() {
        return this.dateCreated;
    }
    
    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }
    public String getActivelyPushout() {
        return this.activelyPushout;
    }
    
    public void setActivelyPushout(String activelyPushout) {
        this.activelyPushout = activelyPushout;
    }
    public String getMessageTitle() {
        return this.messageTitle;
    }
    
    public void setMessageTitle(String messageTitle) {
        this.messageTitle = messageTitle;
    }
    public String getMessageContent() {
        return this.messageContent;
    }
    
    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }
    public String getStatus() {
        return this.status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }




}


