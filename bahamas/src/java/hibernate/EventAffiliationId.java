package hibernate;
// Generated 21 May, 2016 5:04:19 PM by Hibernate Tools 4.3.1



/**
 * EventAffiliationId generated by hbm2java
 */
public class EventAffiliationId  implements java.io.Serializable {


     private int eventId;
     private String teamName;

    public EventAffiliationId() {
    }

    public EventAffiliationId(int eventId, String teamName) {
       this.eventId = eventId;
       this.teamName = teamName;
    }
   
    public int getEventId() {
        return this.eventId;
    }
    
    public void setEventId(int eventId) {
        this.eventId = eventId;
    }
    public String getTeamName() {
        return this.teamName;
    }
    
    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }


   public boolean equals(Object other) {
         if ( (this == other ) ) return true;
		 if ( (other == null ) ) return false;
		 if ( !(other instanceof EventAffiliationId) ) return false;
		 EventAffiliationId castOther = ( EventAffiliationId ) other; 
         
		 return (this.getEventId()==castOther.getEventId())
 && ( (this.getTeamName()==castOther.getTeamName()) || ( this.getTeamName()!=null && castOther.getTeamName()!=null && this.getTeamName().equals(castOther.getTeamName()) ) );
   }
   
   public int hashCode() {
         int result = 17;
         
         result = 37 * result + this.getEventId();
         result = 37 * result + ( getTeamName() == null ? 0 : this.getTeamName().hashCode() );
         return result;
   }   


}


