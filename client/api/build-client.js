import axios from "axios";

<<<<<<< Updated upstream
const buildClient = ({ req }) => {
=======
export default ({ req }) => {
>>>>>>> Stashed changes
  if (typeof window === "undefined") {
    // We are on the server

    return axios.create({
      baseURL:
<<<<<<< Updated upstream
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
=======
        "http://ingress-nginx-controllerr.ingress-nginx.svc.cluster.local",
>>>>>>> Stashed changes
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};

export default buildClient;
