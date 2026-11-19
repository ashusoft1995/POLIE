export const mockOfficerList = [
  { id:"O001", name:"Det. Abebe Girma",     badge:"DET-012", rank:"Detective Sergeant",  dept:"CID",        status:"Active",   email:"abebe.girma@hossanapolice.gov.et",   phone:"+251 911 001 001", joined:"2018-03-15" },
  { id:"O002", name:"Off. Meron Tadesse",   badge:"PRV-021", rank:"Police Officer I",    dept:"Preventive", status:"Active",   email:"meron.tadesse@hossanapolice.gov.et", phone:"+251 911 002 002", joined:"2020-07-01" },
  { id:"O003", name:"Off. Kebede Alemu",    badge:"TRF-033", rank:"Traffic Officer",     dept:"Traffic",    status:"Active",   email:"kebede.alemu@hossanapolice.gov.et",  phone:"+251 911 003 003", joined:"2019-11-20" },
  { id:"O004", name:"Sgt. Lemlem Haile",    badge:"DET-018", rank:"Detective Constable", dept:"CID",        status:"Active",   email:"lemlem.haile@hossanapolice.gov.et",  phone:"+251 911 004 004", joined:"2017-05-10" },
  { id:"O005", name:"Off. Dawit Bekele",    badge:"PRV-029", rank:"Police Officer II",   dept:"Preventive", status:"On Leave", email:"dawit.bekele@hossanapolice.gov.et",  phone:"+251 911 005 005", joined:"2021-02-14" },
  { id:"O006", name:"Insp. Almaz Worku",    badge:"PRV-005", rank:"Inspector",           dept:"Preventive", status:"Active",   email:"almaz.worku@hossanapolice.gov.et",   phone:"+251 911 006 006", joined:"2015-09-08" },
  { id:"O007", name:"Off. Yonas Tesfaye",   badge:"TRF-041", rank:"Traffic Officer",     dept:"Traffic",    status:"Suspended",email:"yonas.tesfaye@hossanapolice.gov.et", phone:"+251 911 007 007", joined:"2022-01-30" },
  { id:"O008", name:"Det. Tigist Mekonnen", badge:"DET-022", rank:"Detective Sergeant",  dept:"CID",        status:"Active",   email:"tigist.mekonnen@hossanapolice.gov.et",phone:"+251 911 008 008",joined:"2016-06-25" },
];

export const mockLeaveRequests = [
  { id:"L001", officer:"Off. Dawit Bekele",    badge:"PRV-029", type:"Annual Leave",   from:"2024-11-20", to:"2024-12-04", days:14, status:"Approved", reason:"Family event" },
  { id:"L002", officer:"Off. Kebede Alemu",    badge:"TRF-033", type:"Sick Leave",     from:"2024-11-28", to:"2024-11-30", days:3,  status:"Pending",  reason:"Medical appointment" },
  { id:"L003", officer:"Sgt. Lemlem Haile",    badge:"DET-018", type:"Emergency Leave",from:"2024-12-01", to:"2024-12-02", days:2,  status:"Pending",  reason:"Personal emergency" },
  { id:"L004", officer:"Insp. Almaz Worku",    badge:"PRV-005", type:"Annual Leave",   from:"2024-12-10", to:"2024-12-20", days:10, status:"Approved", reason:"Annual holiday" },
];

export const mockPayroll = [
  { id:"P001", officer:"Chief Habtamu Woldemariam", badge:"PHD-001", rank:"Chief of Police",     basic:18500, allowance:4200, deduction:1800, net:20900 },
  { id:"P002", officer:"Det. Abebe Girma",          badge:"DET-012", rank:"Detective Sergeant",  basic:12000, allowance:2800, deduction:1200, net:13600 },
  { id:"P003", officer:"Off. Meron Tadesse",        badge:"PRV-021", rank:"Police Officer I",    basic:8500,  allowance:1800, deduction:850,  net:9450  },
  { id:"P004", officer:"Off. Kebede Alemu",         badge:"TRF-033", rank:"Traffic Officer",     basic:9000,  allowance:2000, deduction:900,  net:10100 },
  { id:"P005", officer:"Det. Tigist Mekonnen",      badge:"DET-022", rank:"Detective Sergeant",  basic:12000, allowance:2800, deduction:1200, net:13600 },
  { id:"P006", officer:"Insp. Almaz Bekele",        badge:"HR-005",  rank:"HR Inspector",        basic:11000, allowance:2400, deduction:1100, net:12300 },
];
