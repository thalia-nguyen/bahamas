/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bahamas.entity;

import java.util.Date;

/**
 *
 * @author Darryl Mok
 */
public class OfficeHeld {
    private Contact contact;
    private int contactId;
    private Date dateCreated = new java.util.Date();
    private Date startOffice;
    private Date endOffice;
    private String remarks;
    private String createdBy;
    private String officeHeldPosition;

    public OfficeHeld(Contact contact, Date startOffice, Date endOffice, String remarks, String createdBy, String officeHeldPosition) {
        this.contact = contact;
        this.startOffice = startOffice;
        this.endOffice = endOffice;
        this.remarks = remarks;
        this.createdBy = createdBy;
        this.officeHeldPosition = officeHeldPosition;
    }

    public OfficeHeld(Date startOffice, Date endOffice, String remarks, Date dateCreated, String createdBy, String officeHeldPosition) {
        this.startOffice = startOffice;
        this.endOffice = endOffice;
        this.remarks = remarks;
        this.dateCreated = dateCreated;
        this.createdBy = createdBy;
        this.officeHeldPosition = officeHeldPosition;
    }
    
    public OfficeHeld(int contactId, Date startOffice, Date endOffice, String remarks, Date dateCreated, String createdBy, String officeHeldPosition) {
        this.contactId = contactId;
        this.startOffice = startOffice;
        this.endOffice = endOffice;
        this.dateCreated = dateCreated;
        this.remarks = remarks;
        this.createdBy = createdBy;
        this.officeHeldPosition = officeHeldPosition;
    }

    public int getContactId() {
        return contactId;
    }

    public void setContactId(int contactId) {
        this.contactId = contactId;
    }

    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public Date getStartOffice() {
        return startOffice;
    }

    public void setStartOffice(Date startOffice) {
        this.startOffice = startOffice;
    }

    public Date getEndOffice() {
        return endOffice;
    }

    public void setEndOffice(Date endOffice) {
        this.endOffice = endOffice;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getOfficeHeldPosition() {
        return officeHeldPosition;
    }

    public void setOfficeHeldPosition(String officeHeldPosition) {
        this.officeHeldPosition = officeHeldPosition;
    }
    
    
    
    
}
