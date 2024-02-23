import { ZoomApiConnection, ZoomAuthConnection } from "./zoom.api.js"

const zoomOAuthApi = new ZoomAuthConnection({
    type: "authorization_code",
    client_id: "zqRwXuwTBS7zTPmbsmhJw",
    client_secret: "L324jJqmPKC1icz6nhVlNSCZjG6T2Q86",
    redirect_uri: "http://localhost:4200/authorized-zoom-client"
});
const zoomApiConnection = new ZoomApiConnection(zoomOAuthApi);

export const controllers = {

    async setToken(req, res){
        try {
            let {user_authorization_code} = req.body;
            if(!user_authorization_code) throw new Error("No code.");
            let tk_request = await zoomOAuthApi.setUserApiToken(user_authorization_code);
            if(!tk_request) throw new Error("Error de Autorizacion.")
            return res.status(200).send(tk_request);
        } catch (error) {
            return res.status(500).send({mesage: error.message});
        }
    },

    async getUserInfo(req, res){
        try {
            let user = await zoomApiConnection.getUserInfo();
            return res.status(200).send(user);
        } catch (error) {
            return res.status(500).send({mesage: error.message});
        }        
    },

    async getUsersAccounts(req, res){
        try{
            let data = await zoomApiConnection.getUsersAccounts();
            return res.status(200).send(data.users);
        }catch (error){
            console.log({error, res:error.response});
            return res.status(500).send({message: error.message});
        }
    },

    async getAllWM(req,res){
        try {
            let {wm} = req.params;
            let {type, user_id} = req.query;
            let data = [];
            let params = {};
            params["type"] = type?type:"live";
            do {
                let response = await zoomApiConnection.getAllWM(wm, params, user_id);
                data = [...data, ...response[wm]];
                params['next_page_token'] = response.next_page_token;
            } while (!!params['next_page_token'] || params['next_page_token'] != "");
            return res.status(200).send(data);
        } catch (error) {
            console.log({data: error});
            return res.status(500).send({mesage: error.message});            
        }
    },

    async getWM(req, res){
        try {
            let {wm, wmId} = req.params;
            let {type, user_id} = req.query;
            let params = {};
            params["type"] = type?type:"live";
            let data = await zoomApiConnection.getWM(wm, wmId);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(500).send({mesage: error.message});                        
        }
    },

    async getAllParticipants(req, res){
        try {
            let {wm, wmId} = req.params;
            let {type} = req.query;
            let data = [];
            let params = {};
            params["type"] = type?type:"live";
            do {
                let response = await zoomApiConnection.getMetricsParticipants(wm, wmId, params);
                data = [...data, ...response.participants];
                params["next_page_token"] = response.next_page_token;                
            } while (params["next_page_token"] || params["next_page_token"] != "");
            return res.status(200).send(data);
        } catch (error) {
            console.log({error})
            return res.status(500).send({mesage: error.message});                        
        }
    },

    async getRegistrants(req, res){
        try {
            let {wm, wmId} = req.params;
            let {type} = req.query;
            let data = [];
            let params = {};
            params["type"] = type?type:"live";
            do {
                let response = await zoomApiConnection.getRegistrants(wm, wmId, params);
                data = [...data, ...response.registrants];
                params["next_page_token"] = response.next_page_token;                
            } while (params["next_page_token"] || params["next_page_token"] != "");
            return res.status(200).send(data);
        } catch (error) {
            console.log({error});
            return res.status(500).send({mesage: error.message});                        
        }
    }
}