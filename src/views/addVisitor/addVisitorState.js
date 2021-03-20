const initialState = {
  keyword: '',
  items: [],
  isVisitorRecordAdded: false,
  visitorsId: null,
  visitorRecord: {
    emiratesId: '',
    name: '',
    email: '',
    contact: ''
  },

  receiptFormVisibility: false,
  showAddReceiptForm: false,

  doctorFormVisibility: false,
  isDoctorVisitAdded: false,

  receiptItems: [],
  doctorsReceipt: {
    pet: null,
    fee: '',
    appointmentDate: null,
    isFollowUp: false
  }
}

export default initialState