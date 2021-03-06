import smtplib
import ConfigParser
import datetime
import sys
import mysql.connector
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email( from_address,to_address,min,current,event_title,created_by,event_date ):
	try:
		fromaddr = from_address
		toaddr = to_address
		msg = MIMEMultipart()
		msg['From'] = fromaddr
		msg['To'] = toaddr
		msg['Subject'] = "Bahamas, Event Alert on minimum participation"
		
		body = "Dear " + created_by + ",\n\n" + "Your event " + event_title + " on " + event_date + " have minimum participation of " + min + ' while current participation is ' + current + '.'
		
		msg.attach(MIMEText(body, 'plain'))
		
		server = smtplib.SMTP_SSL(email_smtp, email_port)
		server.ehlo()
		server.login(email_username,email_password) 
		server.sendmail(fromaddr, toaddr, msg.as_string())
		
		print str(now) + ' Email sent ' + toaddr 
	except:
		print str(now) + ' Send email failed ' + toaddr
	finally:
		server.quit()
		return

now = datetime.datetime.now()

#/var/lib/tomcat8/webapps/bahamas/WEB-INF/classes/
#C:/Java/twc/bahamas/build/web/WEB-INF/classes/

email_props_file = 'C:/Java/twc/bahamas/build/web/WEB-INF/classes/email.properties'
db_props_file = 'C:/Java/twc/bahamas/build/web/WEB-INF/classes/connection.properties'

config = ConfigParser.RawConfigParser()

try:
	config.read(email_props_file)
	email_username = config.get('Email','email.username')
	email_password = config.get('Email','email.password')
	email_smtp = config.get('Email','email.smtp')
	email_port = config.get('Email','email.port')

	config.read(db_props_file)
	db_host = config.get('Connection','db.host')
	db_port = config.get('Connection','db.port')
	db_name = config.get('Connection','db.name')
	db_user = config.get('Connection','db.user')
	db_password = config.get('Connection','db.password')

except:
	print str(now) + ' Error reading properties files'
	sys.exit(0)

try:
	#retrieve db data
	# Open database connection
	conn = mysql.connector.connect(user=db_user,password=db_password,database=db_name,host=db_host,port=db_port)

	# prepare a cursor object using cursor() method
	cursor = conn.cursor()

	#Prepare query
	query = """SELECT EMAIL,MINIMUM_PARTICIPATIONS,PARTICIPANT_NUMBER,EVENT_TITLE,CREATED_BY, DATE(EVENT_START_DATE) as EVENT_DATE 
	FROM EVENT WHERE CURDATE() < DATE(EVENT_START_DATE) AND DATE_ADD(CURDATE(), INTERVAL 3 DAY) >= DATE(EVENT_START_DATE)
	AND PARTICIPANT_NUMBER < MINIMUM_PARTICIPATIONS AND SEND_REMINDER=TRUE AND EMAIL IS NOT NULL AND EVENT_STATUS LIKE '%Open%'"""

	# execute SQL query using execute() method.
	cursor.execute(query)
	try:
		# Fetch a single row using fetchone() method.
		for row in cursor.fetchall():
			#do something here
			email = str(row[0])
			min_pax = str(row[1])
			partition_num = str(row[2])
			title = str(row[3])
			created_by = str(row[4])
			date = str(row[5])
			#using values to send email to each candidate
			send_email(email_username,email,min_pax,partition_num,title,created_by,date)
	except:
		print str(now) +  " Error fetching rows from database"
		sys.exit(0)
except:
	print str(now) +  " Error accessing database"
	sys.exit(0)
finally:
	cursor.close()
	conn.close()
