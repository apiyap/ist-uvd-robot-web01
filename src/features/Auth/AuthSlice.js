import {
  createSlice,
  // nanoid,
  createAsyncThunk,
  // createSelector,
  // createEntityAdapter,
} from "@reduxjs/toolkit";


const initialState = {
  login_retry: 0,
  logingin: {
    client_id: "",
    code: "",
    auth_state: "",
    url: "",
  },
  user: {
    access_token: "",
    expires_in: 0,
    refresh_token: "",
    scope: null,
    time: null,
    client_id : "",
    token_type: "",
  },
  error: {
    client_id: "",
    error: "",
    error_description: "",
    auth_state: "",
  },
  status: "idle",
};



export const authPost = createAsyncThunk(
  "auth/post",
  // The payload creator receives the partial `{title, content, user}` object
  async (initialPost) => {
    const response = await fetch(initialPost.url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        //"Access-Control-Allow-Origin": "*",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(initialPost.data), // body data type must match "Content-Type" header
      //body: data, // body data type must match "Content-Type" header
    })
      .then((json) => json.json())
      .then(function (data) {
        //console.log('Request succeeded with JSON response', data);
        //console.log(data)
        return data;
      })
      .catch(function (error) {
        console.log("Request failed", error);
        return error;
      });

    return response; // parses JSON response into native JavaScript objects
  }
);

export const authPass = createAsyncThunk(
  "auth/pass",
  // The payload creator receives the partial `{title, content, user}` object
  async (initialPost) => {
    //initialPost.data['grant_type'] = 'authorization_code';
    //console.log(initialPost.data)
    const response = await fetch(initialPost.url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        //"Access-Control-Allow-Origin": "*",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(initialPost.data), // body data type must match "Content-Type" header
      //body: data, // body data type must match "Content-Type" header
    })
      .then((json) => json.json())
      .then(function (data) {
        //console.log('Request succeeded with JSON response', data);
        //console.log(data)
        return data;
      })
      .catch(function (error) {
        console.log("Request failed", error);
        return error;
      });

    return response; // parses JSON response into native JavaScript objects
  }
);

export const authUser = createAsyncThunk(
  "auth/user",
  // The payload creator receives the partial `{title, content, user}` object
  async () => {
    //initialPost.data['grant_type'] = 'authorization_code';
    //console.log(initialPost.data)
    const response = await fetch("/api/user", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        //"Access-Control-Allow-Origin": "*",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      //body: JSON.stringify(initialPost.data), // body data type must match "Content-Type" header
      //body: data, // body data type must match "Content-Type" header
    })
      .then((json) => json.json())
      .then(function (data) {
        //console.log('Request succeeded with JSON response', data);
        //console.log(data)
        return data;
      })
      .catch(function (error) {
        console.log("Request failed", error);
        return error;
      });

    return response; // parses JSON response into native JavaScript objects
  }
);

export const authRefresh = createAsyncThunk(
  "auth/refresh",
  // The payload creator receives the partial `{title, content, user}` object
  async (initialPost) => {
    //initialPost.data['grant_type'] = 'authorization_code';
    //console.log(initialPost.data)
    const response = await fetch("/api/refresh", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        //"Access-Control-Allow-Origin": "*",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(initialPost.data), // body data type must match "Content-Type" header
      //body: data, // body data type must match "Content-Type" header
    })
      .then((json) => json.json())
      .then(function (data) {
        //console.log('Request succeeded with JSON response', data);
        //console.log(data)
        return data;
      })
      .catch(function (error) {
        console.log("Request failed", error);
        return error;
      });

    return response; // parses JSON response into native JavaScript objects
  }
);

export const authLogout = createAsyncThunk(
  "auth/logout",
  // The payload creator receives the partial `{title, content, user}` object
  async () => {
    //initialPost.data['grant_type'] = 'authorization_code';
    //console.log(initialPost.data)
    const response = await fetch("/api/logout", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        //"Access-Control-Allow-Origin": "*",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      //body: JSON.stringify(initialPost.data), // body data type must match "Content-Type" header
      //body: data, // body data type must match "Content-Type" header
    })
      .then((json) => json.json())
      .then(function (data) {
        //console.log('Request succeeded with JSON response', data);
        //console.log(data)
        return data;
      })
      .catch(function (error) {
        console.log("Request failed", error);
        return error;
      });

    return response; // parses JSON response into native JavaScript objects
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // updateLogin(state, action) {
    //     const { client_id, code, full_url,auth_state,url } = action.payload
    //     state.logedin.client_id = client_id;
    //     state.logedin.code = code;
    //     state.logedin.full_url = full_url;
    //     state.logedin.auth_state = auth_state;
    //     state.logedin.url = url;
    // },
    // updateErrorLogin(state, action){
    //     const { client_id, error, error_description,auth_state } = action.payload
    //     state.error.client_id = client_id;
    //     state.error.error = error;
    //     state.error.error_description = error_description;
    //     state.error.auth_state = auth_state;
    // },
    // other reducers
  },
  extraReducers: {
    [authPost.pending]: (state, action) => {
      state.status = "loading";
    },
    [authPost.fulfilled]: (state, action) => {
      //console.log(action.payload)
      if (action.payload !== null)
        if (action.payload.url) {
          const { client_id, code, auth_state, url } = action.payload;
          state.logingin.client_id = client_id;
          state.logingin.code = code;
          state.logingin.auth_state = auth_state;
          state.logingin.url = url;
          state.status = auth_state;
        } else {
          const {
            client_id,
            error,
            error_description,
            auth_state,
          } = action.payload;
          state.error.client_id = client_id;
          state.error.error = error;
          state.error.error_description = error_description;
          state.error.auth_state = auth_state;
          state.status = "error";
        }
    },
    [authPost.rejected]: (state, action) => {
      console.log("authPost.rejected");
      state.status = "fail";
    },
    [authPass.pending]: (state, action) => {
      state.status = "loading";
    },
    [authPass.fulfilled]: (state, action) => {
    //  console.log("authPass.fulfilled" + action.payload)
      if (action.payload !== null)
        if (action.payload.error) {
          const { error, error_description } = action.payload;
          state.error.error = error;
          state.error.error_description = error_description;
          state.status = "error";
        } else if (action.payload.access_token) {
          const {
            access_token,
            expires_in,
            refresh_token,
            scope,
            time,
            token_type,
            client_id,
          } = action.payload;
          state.user.access_token = access_token;
          state.user.expires_in = expires_in;
          state.user.refresh_token = refresh_token;
          state.user.scope = scope;
          state.user.time = time;
          state.user.token_type = token_type;
          state.user.client_id = client_id;
          state.status = "success";
        }
    },
    [authPass.rejected]: (state, action) => {
      console.log("authPass.rejected");
    },
    [authUser.pending]: (state, action) => {
      state.status = "loading";
    },
    [authUser.fulfilled]: (state, action) => {
     // console.log(action.payload)
      if (action.payload !== null)
        if (action.payload.access_token) {
          const {
            access_token,
            expires_in,
            refresh_token,
            scope,
            time,
            token_type,
            client_id,
          } = action.payload;
          state.user.access_token = access_token;
          state.user.expires_in = expires_in;
          state.user.refresh_token = refresh_token;
          state.user.scope = scope;
          state.user.time = time;
          state.user.token_type = token_type;
          state.user.client_id = client_id;
          state.status = "success";
        }
    },
    [authUser.rejected]: (state, action) => {
      console.log("authUser.rejected");
    },
    [authLogout.fulfilled]: (state, action) => {
      //console.log(action.payload)
      if (action.payload.logout) {
        state.user.access_token = "";
        state.user.expires_in = 0;
        state.user.refresh_token = "";
        state.user.scope = null;
        state.user.time = null;
        state.user.token_type = "";
        state.status = "idle";
      }
    },
    [authLogout.rejected]: (state, action) => {
      console.log("authLogout.rejected");
    },
    [authRefresh.pending]: (state, action) => {
      state.status = "loading";
    },
    [authRefresh.fulfilled]: (state, action) => {
      //console.log(action.payload);
      if (action.payload !== null)
        if (action.payload.access_token) {
          const {
            access_token,
            expires_in,
            refresh_token,
            scope,
            time,
            token_type,
            client_id,
          } = action.payload;
          state.user.access_token = access_token;
          state.user.expires_in = expires_in;
          state.user.refresh_token = refresh_token;
          state.user.scope = scope;
          state.user.time = time;
          state.user.token_type = token_type;
          state.user.client_id = client_id;
          state.status = "success";
        }
    },
    [authRefresh.rejected]: (state, action) => {
      console.log("authRefresh.rejected");
    },
  },
});

export const { updateLogin, updateErrorLogin } = authSlice.actions;
export default authSlice.reducer;

export const getUserLogingIn = (state) => state.auth.logingin;
export const getErrorLogin = (state) => state.auth.error;
export const getStatusLogin = (state) => state.auth.status;
export const getAuthUser = (state) => state.auth.user;
