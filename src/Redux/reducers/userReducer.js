import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    fullName: '',
    email: '',
    token: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const {fullName, email, token} = action.payload
            state.fullName = fullName
            state.email = email
            state.token = token
        }
    }
})

export const {updateUser} = userSlice.actions

export default userSlice.reducer