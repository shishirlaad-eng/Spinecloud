// Helper to convert time string to minutes
const timeToMinutes = (time: string) => {
  const [hours, mins] = time.split(':').map(Number);
  return hours * 60 + mins;
};

// Helper to check if two appointments overlap
const doAppointmentsOverlap = (start1: string, end1: string, start2: string, end2: string) => {
  const start1Min = timeToMinutes(start1);
  const end1Min = timeToMinutes(end1);
  const start2Min = timeToMinutes(start2);
  const end2Min = timeToMinutes(end2);
  return start1Min < end2Min && start2Min < end1Min;
};

export const generateDummyAppointments = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Helper function to add days to a date
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  // Patient names for variety
  const patients = [
    { id: "PT-001", name: "John Smith" },
    { id: "PT-002", name: "Sarah Johnson" },
    { id: "PT-003", name: "James Wilson" },
    { id: "PT-004", name: "Maria Garcia" },
    { id: "PT-005", name: "Robert Martinez" },
    { id: "PT-006", name: "Jennifer Lee" },
    { id: "PT-007", name: "Michael Brown" },
    { id: "PT-008", name: "Emma Wilson" },
    { id: "PT-009", name: "James Martinez" },
    { id: "PT-010", name: "Sophia Anderson" },
    { id: "PT-011", name: "Oliver Brown" },
    { id: "PT-012", name: "Ava Davis" },
    { id: "PT-013", name: "Liam Garcia" },
    { id: "PT-014", name: "Isabella Miller" },
    { id: "PT-015", name: "Noah Rodriguez" },
    { id: "PT-016", name: "Mia Taylor" },
    { id: "PT-017", name: "Ethan Thomas" },
    { id: "PT-018", name: "Charlotte Jackson" },
    { id: "PT-019", name: "Mason White" },
    { id: "PT-020", name: "Amelia Harris" },
    { id: "PT-021", name: "Lucas Martin" },
  ];
  
  // Services
  const services = ["Initial Consultation", "Follow-up", "Physical Therapy", "Acupuncture", "Initial Assessment", "SpineCloud IQ Scan", "Consultation", "Wellness Session", "Massage Therapy"];
  
  const dummyAppointments: any[] = [];
  let aptId = 1;
  
  // Track appointments by provider and date to prevent overlaps
  const providerSchedules: { [key: string]: { [date: string]: Array<{start: string, end: string}> } } = {
    "user-1": {},
    "user-2": {}
  };
  
  // Generate appointments for past 2 weeks, current week, and next 4 weeks (7 weeks total)
  for (let dayOffset = -14; dayOffset <= 28; dayOffset++) {
    const appointmentDate = addDays(today, dayOffset);
    const dayOfWeek = appointmentDate.getDay();
    const dateStr = formatDate(appointmentDate);
    
    // Skip Sundays (0)
    if (dayOfWeek === 0) continue;
    
    // Determine number of appointments based on day - reduced for less clutter
    let appointmentsPerDay;
    if (dayOfWeek === 6) {
      appointmentsPerDay = 1 + Math.floor(Math.random() * 2); // 1-2 on Saturday
    } else if (dayOfWeek === 1 || dayOfWeek === 3) {
      appointmentsPerDay = 3 + Math.floor(Math.random() * 3); // 3-5 on Mon/Wed
    } else {
      appointmentsPerDay = 2 + Math.floor(Math.random() * 2); // 2-3 on Tue/Thu/Fri
    }
    
    // Generate appointments for this day
    let attempts = 0;
    let successfulAppointments = 0;
    
    while (successfulAppointments < appointmentsPerDay && attempts < appointmentsPerDay * 3) {
      attempts++;
      
      // Random hour between 8 AM and 6 PM
      const startHour = 8 + Math.floor(Math.random() * 10);
      const startMinute = Math.random() > 0.5 ? "00" : "30";
      const startTime = `${startHour.toString().padStart(2, "0")}:${startMinute}`;
      
      // End time is 30 or 60 minutes later
      const duration = Math.random() > 0.5 ? 30 : 60;
      const endMinutes = startHour * 60 + parseInt(startMinute) + duration;
      const endHour = Math.floor(endMinutes / 60);
      const endMin = endMinutes % 60;
      const endTime = `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`;
      
      // Don't create appointments after 7 PM
      if (endHour >= 19) continue;
      
      // Random provider (user-1 or user-2)
      const providerId = Math.random() > 0.6 ? "user-1" : "user-2";
      
      // Check for overlaps with existing appointments for this provider on this date
      if (!providerSchedules[providerId][dateStr]) {
        providerSchedules[providerId][dateStr] = [];
      }
      
      const hasOverlap = providerSchedules[providerId][dateStr].some(apt => 
        doAppointmentsOverlap(startTime, endTime, apt.start, apt.end)
      );
      
      if (hasOverlap) continue; // Skip this appointment and try again
      
      // Random location (branch-1 or branch-2, rarely branch-3)
      const rand = Math.random();
      let locationId;
      if (rand < 0.45) {
        locationId = "branch-1";
      } else if (rand < 0.90) {
        locationId = "branch-2";
      } else {
        locationId = "branch-3";
      }
      
      // Random service
      const service = services[Math.floor(Math.random() * services.length)];
      
      // Status based on date
      let status: "Confirmed" | "Cancelled" | "Completed";
      if (dayOffset < 0) {
        // Past appointments
        status = Math.random() > 0.15 ? "Completed" : "Cancelled";
      } else {
        // Today and future appointments
        const rand = Math.random();
        if (rand < 0.85) status = "Confirmed";
        else status = "Cancelled";
      }
      
      // Random patient
      const patient = patients[Math.floor(Math.random() * patients.length)];
      
      // Add to schedule tracker
      providerSchedules[providerId][dateStr].push({ start: startTime, end: endTime });
      
      // Create base appointment object
      const appointment: any = {
        id: `apt-${aptId++}`,
        patientName: patient.name,
        patientId: patient.id,
        providerId,
        locationId,
        date: dateStr,
        startTime,
        endTime,
        service,
        status,
      };
      
      // Add completedAt timestamp for completed appointments
      if (status === "Completed") {
        const appointmentDateTime = new Date(appointmentDate);
        const [endHourNum, endMinNum] = endTime.split(':').map(Number);
        appointmentDateTime.setHours(endHourNum, endMinNum + Math.floor(Math.random() * 15) + 5, 0, 0); // Completed 5-20 minutes after end time
        appointment.completedAt = appointmentDateTime.toISOString();
      }
      
      dummyAppointments.push(appointment);
      
      successfulAppointments++;
    }
  }
  
  return dummyAppointments;
};