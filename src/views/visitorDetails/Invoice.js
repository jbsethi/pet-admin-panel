const Invoice = () => {
  return (
    <div class="container">
      <div class="row">
        <div class="col-6">
          <h3 class="text-secondary">Stanford Plumbing & Heating</h3>
          <h6 class="text-secondary">123 Madison drive, Seattle, WA 12387Q</h6>
          <h6><a class="text-secondary" href="mailto:clinic@gmail.com">app@aloropivetcenter.com</a></h6>
          <h6 class="text-secondary">+97 123 456 789</h6>
        </div>
        <div class="col-6">
          <h3 class="text-secondary text-uppercase text-right font-weight-bold">Invoice</h3>
          <div class="d-flex justify-content-end">
            <img width="120px" src="https://app.aloropivetcenter.com/static/media/logo.ac9a8e2d.png"/>
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
                <div class="col-6"><p class="text-right mb-0">#AV12345</p></div>
              </div>
              <div class="row">
                <div class="col-6"><h6 class="text-right">Invoice Date :</h6></div>
                <div class="col-6"><p class="text-right mb-0">03-12-2020</p></div>
              </div>
              <div class="row">
                <div class="col-6"><h6 class="text-right">Due Date :</h6></div>
                <div class="col-6"><p class="text-right mb-0">03-12-2020</p></div>
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
                <th class="text-center">Unit Price</th>
                <th class="text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dog Premium Food 1</td>
                <td class="text-center">2</td>
                <td class="text-right">150.00</td>
                <td class="text-right">300.00</td>
              </tr>
              <tr>
                <td>Dog Premium Food 1</td>
                <td class="text-center">2</td>
                <td class="text-right">150.00</td>
                <td class="text-right">300.00</td>
              </tr>
              <tr>
                <td>Dog Premium Food 1</td>
                <td class="text-center">2</td>
                <td class="text-right">150.00</td>
                <td class="text-right">300.00</td>
              </tr>
              <tr>
                <td>Dog Premium Food 1</td>
                <td class="text-center">2</td>
                <td class="text-right">150.00</td>
                <td class="text-right">300.00</td>
              </tr>
              <tr>
                <td>Dog Premium Food 1</td>
                <td class="text-center">2</td>
                <td class="text-right">150.00</td>
                <td class="text-right">300.00</td>
              </tr>
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
                <div class="col-4"><p class="text-right mb-0 border-bottom">1500.00</p></div>
              </div>
              <div class="row">
                <div class="col-8"><h6 class="text-right text-uppercase">discount :</h6></div>
                <div class="col-4"><p class="text-right mb-0 border-bottom">0.00</p></div>
              </div>
              <div class="row">
                <div class="col-8"><h6 class="text-right text-uppercase">subtotal less discount :</h6></div>
                <div class="col-4"><p class="text-right mb-0">1500.00</p></div>
              </div>
            </div>
          </div>
          <div class="row d-flex justify-content-end mt-4">
            <div class="col-7 border-bottom border-top pt-2">
              <div class="row">
                <div class="col-8"><h6 class="text-right text-uppercase">Balance :</h6></div>
                <div class="col-4 pl-0"><h6 class="text-right mb-0">AED 1500.00</h6></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice