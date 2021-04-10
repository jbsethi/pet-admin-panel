import LogoPng from '../../assets/logo/logo.png'

const Invoice = ({ data }) => {
  const formatDateString = (str) => {
    const date = new Date(str)

    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }
  return !data ? '' : (
    <div class="container">
      <div class="row">
        <div class="col-6">
          <h3 class="text-secondary">Aloropi Vet Center</h3>
          <h6 class="text-secondary">123 Madison drive, Seattle, WA 12387Q</h6>
          <h6><a class="text-secondary" href="mailto:clinic@gmail.com">app@aloropivetcenter.com</a></h6>
          <h6 class="text-secondary">+97 123 456 789</h6>
        </div>
        <div class="col-6">
          <h3 class="text-secondary text-uppercase text-right font-weight-bold">Invoice</h3>
          <div class="d-flex justify-content-end">
            <img width="120px" src={LogoPng} alt="logo"/>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-4">
          <h6 class="text-secondary border-bottom">Billed To</h6>
          <p class="text-secondary mb-0">87 Private Street, Seattle WA</p>
          <p class="text-secondary mb-0"><a class="text-secondary" href="mailto:allen@gmail.com">allen@gmail.com</a></p>
          <p class="text-secondary mb-0">+97 123 456 789</p>
        </div>
        <div class="col-8">
          <div class="row d-flex justify-content-end">
            <div class="col-5">
              <div class="row">
                <div class="col-6"><h6 class="text-right">Invoice No :</h6></div>
                <div class="col-6"><p class="text-right mb-0">{ `#${data.id}` }</p></div>
              </div>
              <div class="row">
                <div class="col-6"><h6 class="text-right">Invoice Date :</h6></div>
                <div class="col-6"><p class="text-right mb-0">{formatDateString(data.createdAt)}</p></div>
              </div>
              <div class="row">
                <div class="col-6"><h6 class="text-right">Due Date :</h6></div>
                <div class="col-6"><p class="text-right mb-0">{formatDateString(data.createdAt)}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-12">
          <table class="table table-bordered table-striped table-sm text-secondary">
            <thead>
              <tr>
                <th class="text-center">Item Name</th>
                <th class="text-center">Quantity</th>
                <th class="text-center">Category</th>
                <th class="text-center">Unit Price</th>
                <th class="text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {
                (data.Items || []).map(item => {
                  return (
                    <tr>
                      <td>{item.Item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.Item.serviceId}</td>
                      <td>{item.Item.price}</td>
                      <td>{item.Item.price * item.quantity}</td>
                    </tr>
                  )
                })
              }
              {
                (data.Packages || []).map(item => {
                  return (
                    <tr>
                      <td>{item.Item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.Item.serviceId}</td>
                      <td>{item.Item.price}</td>
                      <td>{item.Item.price * item.quantity}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-4 d-flex justify-content-center align-items-center">
          <h6 class="text-secondary">Thankyou for comming</h6>
        </div>
        <div class="col-8">
          <div class="row d-flex justify-content-end">
            <div class="col-7">
              <div class="row">
                <div class="col-8"><h6 class="text-right text-uppercase">SubTotal :</h6></div>
                <div class="col-4"><p class="text-right mb-0 border-bottom">{data.price}</p></div>
              </div>
              <div class="row">
                <div class="col-8"><h6 class="text-right text-uppercase">discount :</h6></div>
                <div class="col-4"><p class="text-right mb-0 border-bottom">0.00</p></div>
              </div>
              <div class="row">
                <div class="col-8"><h6 class="text-right text-uppercase">subtotal less discount :</h6></div>
                <div class="col-4"><p class="text-right mb-0">{data.price}</p></div>
              </div>
            </div>
          </div>
          <div class="row d-flex justify-content-end mt-4">
            <div class="col-7 border-bottom border-top pt-2">
              <div class="row">
                <div class="col-8"><h6 class="text-right text-uppercase">Balance :</h6></div>
                <div class="col-4 pl-0"><h6 class="text-right mb-0">AED {data.price}</h6></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice
