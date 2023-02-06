import base64 from "base-64";
import { NextFunction, Request, Response } from "express";

/*
  ! steps for basic http authentication:
    1- client sends a request to the server requesting a resource or page.
    2- server checks for the existence of the authorization header.
      * if No -> set the (www-authenticate) header to `basic realm="whatever"` and a status code of 401
        ?Note: "basic" here tells the browser to show the basic HTTP authentication pop-up. and "realm" is a value that is assigned to a group of pages that share the same credentials.
      * if yes -> decode the (authorization) header using (base64 decoding), extract the username and password from it and verify them.
        ?Note: after using fills the username and password in the client side and sends the credentials to the server. browser will automatically encode the credentials using base64 encoding. that's why we need to decode the username and password.
        * if username and password are correct? -> let the user in and send a status code of 200
        * if username and password are incorrect? -> send a status code of 401
*/

type Credentials = {
  username: string,
  password: string
}

const decodeCredentials = (authHeader: string): string => {
  const base64CredentialsString: string = authHeader.split(" ")[1]
  return base64.decode(base64CredentialsString)
}

const extractCredentials = (decodedAuthHeader: any): Credentials => {
  console.log(decodedAuthHeader);
  const [username, password]: [string, string] = decodedAuthHeader.split(':')
  return { username, password }

}

const verifyCredentials = (credentials: Credentials): boolean => {
  return Object.keys(credentials) && credentials.username === "sto" && credentials.password === "password123"
}


export default (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const decoded = decodeCredentials(req.headers.authorization)

    const credentials = extractCredentials(decoded)

    if (verifyCredentials(credentials)) {
      return next();
    }

    res.status(401).send("incorrect password or username!")
    return
  }
  res.status(401).set("www-authenticate", "basic realm='user_pages'").send("Authentication required!")
}