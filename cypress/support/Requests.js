export class Requests {
  environment() {
    return Cypress.env(Cypress.env("run"));
  }

  get({ alias = "response", path = null, equal = null, position = 1 }) {
    cy.get(`@${alias}`, { log: false, timeout: 6000 }).then((response) => {
      let find = this.findInJson(response, path, position);

      expect(find).not.null;
      expect(find).not.undefined;

      if (equal) expect(find).eq(equal);
      cy.wrap(find).as("info");
    });

    return this;
  }

  request({
    method = "GET",
    endpoint = null,
    payload = null,
    headers = null,
    params = null,
    alias = "response",
  }) {
    cy.step(`request in method ${method}`)
      .request({
        method: method,
        url: endpoint,
        body: payload,
        headers: headers,
        qs: params,
      })
      .as(alias);

    return this;
  }

  findInJson(obj, keyToFind, position = 1) {
    let result = null;
    let fullValue = null;
    let count = 0;

    function traverse(obj) {
      let value;
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          value = traverse(obj[i]);
          if (value) return value;
        }
      } else if (typeof obj === "object" && obj !== null) {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (key === keyToFind && Array.isArray(obj[key])) {
              if (obj[key].length >= position) {
                result = obj[key][position - 1];
                fullValue = obj[key];
                throw new Error("Found value");
              }
            } else if (key === keyToFind) {
              count++;
              if (count === position) {
                result = obj[key];
                throw new Error("Found value");
              }
            }
            value = traverse(obj[key]);
            if (value) return value;
          }
        }
      }
    }

    try {
      traverse(obj);
    } catch (e) {
      if (e.message !== "Found value") {
        throw e;
      }
    }

    return fullValue
      ? { object: fullValue, value: result }
      : result
      ? result
      : console.error(`Path ** ${keyToFind} ** not found`);
  }
}
