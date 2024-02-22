import axios from 'axios';

export class ZoomAuthConnection {
    oauth_uri = 'https://zoom.us/oauth/';
    api_uri = 'https://api.zoom.us/v2/';
    get appAuthorization(){
        return Buffer.from(`${this.client_id}:${this.client_secret}`).toString('base64');
    }

    /**
     * 
     * @param {{
     * type: "server_to_server" | "oauth2" | "authorization_code",
     * client_id: string,
     * client_secret: string,
     * account_id?: string,
     * redirect_uri?: string
     * }} credentials
     */

    constructor(credentials){
        let {type, client_id, client_secret, account_id, redirect_uri } = credentials;
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.type = type;
        
        if(type === "authorization_code") {
            this.redirect_uri = redirect_uri;
        }

        if(type === "server_to_server"){
            this.account_id = account_id;
        }
    }

    /**@private */
    setAppHeadersAuthorization(){
        return {
            Authorization: `Basic ${this.appAuthorization}`,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }

    async getToken(user_authorization_code = undefined, grant_type = undefined){
        let headers = this.setAppHeadersAuthorization();

        let data = {};

        if(grant_type==="refresh_token"){
            data['grant_type'] = grant_type;
            data[grant_type] = grant_type;
        }else {   
            if(this.type === "authorization_code"){
                data['code'] = user_authorization_code;
                data['grant_type'] = 'authorization_code';
                data['redirect_uri'] = this.redirect_uri;
            }
            if(this.type === "server_to_server"){
                data['grant_type'] = 'account_credentials';
                data['account_id'] = this.account_id;
            }
        }
        
        return axios.post(`${this.oauth_uri}token`, data, {headers}).then(res=>res.data);
    }

    refreshToken(){
        return this.getToken(undefined, "refresh_token");
    }

    async setUserApiToken(user_authorization_code){
        try {
            let resToken = await this.getToken(user_authorization_code);
            this.token_request = resToken;
            if(this.token_request) return this.token_request;
        } catch (error) {
            console.log({error});
            return false;
        }
    }
}

export class ZoomApiConnection {
    api_uri = 'https://api.zoom.us/v2/';

    /**@param {ZoomAuthConnection} zoomAuthConnection */
    constructor(zoomAuthConnection){
        if(!zoomAuthConnection instanceof ZoomAuthConnection){
            throw new Error("instance error: Proporciona una correcta instancia de ZoomAuthConnection.");
        }
        this.zoomAuthConnection = zoomAuthConnection;
    }

    /**@private */
    get apiHeadersAuthorization(){
        return {
            Authorization: `Bearer ${this.zoomAuthConnection.token_request.access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    getUserInfo(){
        let headers = this.apiHeadersAuthorization;
        return axios.get(`${this.api_uri}users/me`, {headers}).then(res=>res.data);
    }

    getAllMetricsWM(wm, params = {type: "live", next_page_token: null}){
        let headers = this.apiHeadersAuthorization;
        return axios.get(`${this.api_uri}metrics/${wm}`, {headers, params}).then(res=>res.data);
    }

    getAllWM(wm, params = {type: "live", next_page_token: null}){
        let headers = this.apiHeadersAuthorization;
        return axios.get(`${this.api_uri}users/me/${wm}`, {headers, params}).then(res=>res.data);
    }
    
    getMetricsWM(wm, wmId, params = undefined){
        let headers = this.apiHeadersAuthorization;
        return axios.get(`${this.api_uri}metrics/${wm}${wmId}`, {headers, params}).then(res=>res.data);
    }

    getWM(wm, wmId, params = undefined){
        let headers = this.apiHeadersAuthorization;
        return axios.get(`${this.api_uri}${wm}${wmId}`, {headers, params}).then(res=>res.data);
    }
    
    getMetricsParticipants(wm, wmId, params = undefined){
        let headers = this.apiHeadersAuthorization;
        return axios.get(`${this.api_uri}metrics/${wm}/${wmId}/participants`, {headers, params}).then(res=>res.data);
    }

    getParticipants(wm, wmId, params = undefined){
        let headers = this.apiHeadersAuthorization;
        return axios.get(`${this.api_uri}${wm}/${wmId}/participants`, {headers, params}).then(res=>res.data);
    }
    
    getRegistrants(wm, wmId, params = undefined){
        let headers = this.apiHeadersAuthorization;
        return axios.get(`${this.api_uri}${wm}/${wmId}/registrants`, {headers, params}).then(res=>res.data);
    }

}

