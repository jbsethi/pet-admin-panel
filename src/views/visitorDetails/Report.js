import './report.css'

import { formatDate } from '../../utils/dateUtils'

const Report = ({ data }) => {
  return data && (
    <div className="wrapper">
      <h2 className="my-10">Pet Details</h2>

      <table className="table-pet-history mb-50">
        <tbody>
          <tr>
            <td><b>Pet Name</b></td>
            <td>{ data.petRecord.name }</td>
            <td><b>Pet Type</b></td>
            <td>{ data.petRecord.specie }</td>
          </tr>
          <tr>
            <td><b>Owner Name</b></td>
            <td>{ data.patientRecord.name }</td>
            <td><b>Pet Gender</b></td>
            <td>{ data.petRecord.gender }</td>
          </tr>
          <tr>
            <td><b>Owner Contact</b></td>
            <td>{ data.patientRecord.contact }</td>
            <td><b>Pet Age</b></td>
            <td>{ data.petRecord.age } years</td>
          </tr>
          <tr>
            <td><b>Owner ID</b></td>
            <td>{ data.patientRecord.emiratesId }</td>
            <td><b>Pet Color</b></td>
            <td>{ data.petRecord.color }</td>
          </tr>
          <tr>
            <td colspan="4"><b>Pet Detail</b></td>
          </tr>
          <tr>
            <td colspan="4">{ data.petRecord.description || 'Not Available' }</td>
          </tr>
        </tbody>
      </table>

      <h2 className="my-10">Pet History</h2>
      <table className="table-pet-history">
        <thead>
          <tr>
            <th>Date</th>
            <th>Statement</th>
            <th>Prescription</th>
            <th>Recomendations</th>
            <th>Description</th>
          </tr>
        </thead>
          <tbody>
            {
              data.data.map((r, i) => {
                return <tr key={i}>
                  <td>{formatDate(r.createdAt)}</td>
                  <td>{r.statement}</td>
                  <td>{r.prescription}</td>
                  <td>{
                    r.Recomendations.map((rr, ii) => {
                      return <span key={rr.itemId +  '-' + ii}> {rr.Item.name} </span>
                    })
                  }</td>
                  <td>{r.description}</td>
                </tr>
              })
            }
        </tbody>
      </table>
    </div>
  )
}

export default Report
