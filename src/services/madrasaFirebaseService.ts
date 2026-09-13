import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs, 
  writeBatch,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  MadrasaTeacher, 
  MadrasaStudent, 
  MadrasaClass, 
  MadrasaFeeRecord, 
  MadrasaAttendanceDay, 
  MadrasaSabaqRecord, 
  MadrasaExam, 
  MadrasaDonationRecord 
} from '../data/madrasaData';

// Collection Names in Firestore
const COL_STUDENTS = 'madrasa_students';
const COL_TEACHERS = 'madrasa_teachers';
const COL_CLASSES = 'madrasa_classes';
const COL_ATTENDANCE = 'madrasa_attendance';
const COL_SABAQ = 'madrasa_sabaq_records';
const COL_FEES = 'madrasa_fee_records';
const COL_EXAMS = 'madrasa_exams';
const COL_DONATIONS = 'madrasa_donations';

export const madrasaFirebaseService = {
  // Sync Listeners
  subscribeStudents(callback: (students: MadrasaStudent[]) => void) {
    try {
      const q = query(collection(db, COL_STUDENTS));
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: MadrasaStudent[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as MadrasaStudent);
          });
          callback(list);
        }
      }, (error) => {
        console.warn('Firestore students sync notice:', error.message);
      });
    } catch (e) {
      console.warn('Firestore subscription error (students):', e);
      return () => {};
    }
  },

  subscribeTeachers(callback: (teachers: MadrasaTeacher[]) => void) {
    try {
      const q = query(collection(db, COL_TEACHERS));
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: MadrasaTeacher[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as MadrasaTeacher);
          });
          callback(list);
        }
      }, (error) => {
        console.warn('Firestore teachers sync notice:', error.message);
      });
    } catch (e) {
      console.warn('Firestore subscription error (teachers):', e);
      return () => {};
    }
  },

  subscribeClasses(callback: (classes: MadrasaClass[]) => void) {
    try {
      const q = query(collection(db, COL_CLASSES));
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: MadrasaClass[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as MadrasaClass);
          });
          callback(list);
        }
      }, (error) => {
        console.warn('Firestore classes sync notice:', error.message);
      });
    } catch (e) {
      console.warn('Firestore subscription error (classes):', e);
      return () => {};
    }
  },

  subscribeAttendance(callback: (attendance: MadrasaAttendanceDay[]) => void) {
    try {
      const q = query(collection(db, COL_ATTENDANCE));
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: MadrasaAttendanceDay[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as MadrasaAttendanceDay);
          });
          callback(list);
        }
      }, (error) => {
        console.warn('Firestore attendance sync notice:', error.message);
      });
    } catch (e) {
      console.warn('Firestore subscription error (attendance):', e);
      return () => {};
    }
  },

  subscribeSabaq(callback: (sabaq: MadrasaSabaqRecord[]) => void) {
    try {
      const q = query(collection(db, COL_SABAQ));
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: MadrasaSabaqRecord[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as MadrasaSabaqRecord);
          });
          callback(list);
        }
      }, (error) => {
        console.warn('Firestore sabaq sync notice:', error.message);
      });
    } catch (e) {
      console.warn('Firestore subscription error (sabaq):', e);
      return () => {};
    }
  },

  subscribeFees(callback: (fees: MadrasaFeeRecord[]) => void) {
    try {
      const q = query(collection(db, COL_FEES));
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: MadrasaFeeRecord[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as MadrasaFeeRecord);
          });
          callback(list);
        }
      }, (error) => {
        console.warn('Firestore fees sync notice:', error.message);
      });
    } catch (e) {
      console.warn('Firestore subscription error (fees):', e);
      return () => {};
    }
  },

  subscribeExams(callback: (exams: MadrasaExam[]) => void) {
    try {
      const q = query(collection(db, COL_EXAMS));
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: MadrasaExam[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as MadrasaExam);
          });
          callback(list);
        }
      }, (error) => {
        console.warn('Firestore exams sync notice:', error.message);
      });
    } catch (e) {
      console.warn('Firestore subscription error (exams):', e);
      return () => {};
    }
  },

  subscribeDonations(callback: (donations: MadrasaDonationRecord[]) => void) {
    try {
      const q = query(collection(db, COL_DONATIONS));
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: MadrasaDonationRecord[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as MadrasaDonationRecord);
          });
          callback(list);
        }
      }, (error) => {
        console.warn('Firestore donations sync notice:', error.message);
      });
    } catch (e) {
      console.warn('Firestore subscription error (donations):', e);
      return () => {};
    }
  },

  // Save/Update operations
  async saveStudent(student: MadrasaStudent) {
    try {
      await setDoc(doc(db, COL_STUDENTS, student.id), student);
    } catch (e) {
      console.error('Error saving student to cloud:', e);
    }
  },

  async deleteStudent(studentId: string) {
    try {
      await deleteDoc(doc(db, COL_STUDENTS, studentId));
    } catch (e) {
      console.error('Error deleting student from cloud:', e);
    }
  },

  async saveTeacher(teacher: MadrasaTeacher) {
    try {
      await setDoc(doc(db, COL_TEACHERS, teacher.id), teacher);
    } catch (e) {
      console.error('Error saving teacher to cloud:', e);
    }
  },

  async deleteTeacher(teacherId: string) {
    try {
      await deleteDoc(doc(db, COL_TEACHERS, teacherId));
    } catch (e) {
      console.error('Error deleting teacher from cloud:', e);
    }
  },

  async saveClass(cls: MadrasaClass) {
    try {
      await setDoc(doc(db, COL_CLASSES, cls.id), cls);
    } catch (e) {
      console.error('Error saving class to cloud:', e);
    }
  },

  async deleteClass(classId: string) {
    try {
      await deleteDoc(doc(db, COL_CLASSES, classId));
    } catch (e) {
      console.error('Error deleting class from cloud:', e);
    }
  },

  async saveAttendance(att: MadrasaAttendanceDay) {
    try {
      const docId = att.id || `${att.date}_${att.classId}`;
      await setDoc(doc(db, COL_ATTENDANCE, docId), { ...att, id: docId });
    } catch (e) {
      console.error('Error saving attendance to cloud:', e);
    }
  },

  async saveSabaq(sabaq: MadrasaSabaqRecord) {
    try {
      await setDoc(doc(db, COL_SABAQ, sabaq.id), sabaq);
    } catch (e) {
      console.error('Error saving sabaq to cloud:', e);
    }
  },

  async saveFee(fee: MadrasaFeeRecord) {
    try {
      await setDoc(doc(db, COL_FEES, fee.id), fee);
    } catch (e) {
      console.error('Error saving fee to cloud:', e);
    }
  },

  async saveExam(exam: MadrasaExam) {
    try {
      await setDoc(doc(db, COL_EXAMS, exam.id), exam);
    } catch (e) {
      console.error('Error saving exam to cloud:', e);
    }
  },

  async saveDonation(donation: MadrasaDonationRecord) {
    try {
      await setDoc(doc(db, COL_DONATIONS, donation.id), donation);
    } catch (e) {
      console.error('Error saving donation to cloud:', e);
    }
  },

  async deleteDonation(donationId: string) {
    try {
      await deleteDoc(doc(db, COL_DONATIONS, donationId));
    } catch (e) {
      console.error('Error deleting donation from cloud:', e);
    }
  },

  // Bulk Seed initial data to cloud if cloud is empty
  async seedCloudIfEmpty(data: {
    teachers: MadrasaTeacher[];
    classes: MadrasaClass[];
    students: MadrasaStudent[];
    fees: MadrasaFeeRecord[];
    attendance: MadrasaAttendanceDay[];
    sabaqLogs: MadrasaSabaqRecord[];
    exams: MadrasaExam[];
    donations: MadrasaDonationRecord[];
  }) {
    try {
      const studentSnap = await getDocs(collection(db, COL_STUDENTS));
      if (studentSnap.empty) {
        console.log('Seeding initial data to Cloud Firestore...');
        const batch = writeBatch(db);

        data.teachers.forEach(t => batch.set(doc(db, COL_TEACHERS, t.id), t));
        data.classes.forEach(c => batch.set(doc(db, COL_CLASSES, c.id), c));
        data.students.forEach(s => batch.set(doc(db, COL_STUDENTS, s.id), s));
        data.fees.forEach(f => batch.set(doc(db, COL_FEES, f.id), f));
        data.attendance.forEach(a => {
          const docId = a.id || `${a.date}_${a.classId}`;
          batch.set(doc(db, COL_ATTENDANCE, docId), { ...a, id: docId });
        });
        data.sabaqLogs.forEach(s => batch.set(doc(db, COL_SABAQ, s.id), s));
        data.exams.forEach(e => batch.set(doc(db, COL_EXAMS, e.id), e));
        data.donations.forEach(d => batch.set(doc(db, COL_DONATIONS, d.id), d));

        await batch.commit();
        console.log('Cloud Firestore initialized with initial Madrasa records successfully.');
      }
    } catch (e) {
      console.warn('Initial cloud seed notice:', e);
    }
  }
};
