function testUserLogin() {
    cy.request("POST", "/api/auth", {
        email: "testAdmin@gmail.com",
        password: "123456"
    }).then(res => {
        localStorage.setItem("token", res.body.token);
    });
}

export { testUserLogin };
