const addVisitorReducer = (state, { type, payload }) => {
  switch (type) {
    case 'setKeyword':
      return {
        ...state,
        keyword: payload
      }
    case 'setItems': 
      return {
        ...state,
        items: payload
      }
    case 'setIsVisitorRecordAdded':
      return {
        ...state,
        isVisitorRecordAdded: payload
      }
    case 'setVisitorsId':
      return {
        ...state,
        visitorsId: payload
      }
    case 'setVisitorsRecord':
      return {
        ...state,
        visitorRecord: { ...payload }
      }
    case 'handleChangeVisitorRecord':
      return {
        ...state,
        visitorRecord: {
          ...state.visitorRecord,
          [payload.target.name]: payload.target.value 
        }
      }
    case 'setReceiptFormVisibility':
      return {
        ...state,
        receiptFormVisibility: payload
      }
    case 'setShowAddReceiptForm':
      return {
        ...state,
        showAddReceiptForm: payload
      }
    case 'setDoctorFormVisibility':
      return {
        ...state,
        doctorFormVisibility: payload
      }
    case 'setIsDoctorVisitAdded':
      return {
        ...state,
        isDoctorVisitAdded: payload
      }
    case 'addItemInReceipt':
      let isItemId = true
      let itemIdx = -1

      if (payload.packageId?.value) isItemId = false

      if (isItemId) {
        itemIdx = state.receiptItems.findIndex(i => i.id === payload.itemId?.value)
      } else {
        itemIdx = state.receiptItems.findIndex(i => i.packageId === payload.packageId?.value)
      }

      if (itemIdx === -1) {
        const item = {
          id: payload.itemId?.value || null,
          packageId: payload.packageId?.value || null,
          name: payload.itemId?.label || payload.packageId?.label,
          category: payload.categoryId.label,
          price: payload.itemId?.price || payload.packageId?.price,
          qty: payload.quantity,
          total: payload.quantity * (payload.itemId?.price || payload.packageId?.price)
        }
  
        return {
          ...state,
          receiptItems: [...state.receiptItems, item]
        }
      } else {
        return {
          ...state,
          receiptItems: state.receiptItems.map((i, idx) => {
            if (idx === itemIdx) {
              console.log(i, payload)
              const qty = +i.qty + +payload.quantity
              return {
                ...i,
                qty,
                total: qty * i.price
              }
            }

            return i
          })
        }
      }
    case 'removeItem':
      return {
        ...state,
        receiptItems: state.receiptItems.filter(i => {
          if (payload.id) {
            return i.id !== payload.id
          } else {
            return i.packageId !== payload.packageId
          }
        })
      }
    case 'addDoctorReceipt':
      const doctorsReceipt = {
        pet: payload.pet,
        fee: payload.fee,
        appointmentDate: payload.appointmentDate,
        isFollowUp: payload.isFollowUp
      }

      return {
        ...state,
        isDoctorVisitAdded: true,
        doctorsReceipt: doctorsReceipt
      }
    case 'resetForm':
      return {
        ...state,
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
    default: 
      return state
  }
}

export default addVisitorReducer