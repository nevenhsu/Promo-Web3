import * as _ from 'lodash-es'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getUserInfo,
  updateUser as _updateUser,
  updateLinkAccount as _updateLinkAccount,
  deleteLinkAccount as _deleteLinkAccount,
} from '@/services/user'
import { getUserStatus, type TUserStatus } from '@/services/userStatus'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { TUser, LinkedAccount } from '@/models/user'
import type { ReferralCode } from '@/models/referralCode'

export const fetchUser = createAsyncThunk('user/fetch', async () => {
  const data = await getUserInfo()
  return data
})

export const fetchUserStatus = createAsyncThunk('user/fetchStatus', async () => {
  const data = await getUserStatus()
  return data
})

export const updateUser = createAsyncThunk<TUser, Partial<TUser>>('user/update', async data => {
  const updateData = await _updateUser(data)
  return updateData || {}
})

export const updateLinkAccount = createAsyncThunk<TUser, LinkedAccount>(
  '/user/linkAccount',
  async data => {
    const { userId, subject, platform, username } = data

    const user = await _updateLinkAccount({
      userId,
      subject,
      platform,
      username,
    })
    return user
  }
)

export const deleteLinkAccount = createAsyncThunk<TUser, string>(
  'user/deleteLinkAccount',
  async platform => {
    const user = await _deleteLinkAccount(platform)
    return user
  }
)

export interface IUserState {
  _id: string
  fetched: boolean
  updating: boolean // for update user
  linking: boolean // for link account
  data: Partial<TUser>
  statusData?: TUserStatus
  referralData?: ReferralCode
}

const initialState: IUserState = {
  _id: '',
  fetched: false,
  updating: false,
  linking: false,
  data: {},
  statusData: undefined,
  referralData: undefined,
}

export const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setFetched: (state, action: PayloadAction<boolean>) => {
      state.fetched = action.payload
    },
    clearData: state => {
      // for logout
      _.forEach(initialState, (value, key) => {
        // @ts-ignore
        state[key] = value
      })
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      const { user, referralData } = action.payload
      state.data = user
      state._id = user._id || ''
      state.referralData = referralData
      state.fetched = true
    })
    builder.addCase(updateUser.pending, (state, action) => {
      state.updating = true
    })
    builder.addCase(updateUser.fulfilled, (state, action) => {
      const newData = action.payload
      state.updating = false
      if (newData) {
        state.data.linkedAccounts = [] // prevent duplicate
        _.merge(state.data, newData)
      }
    })
    builder.addCase(updateLinkAccount.pending, (state, action) => {
      state.linking = true
    })
    builder.addCase(updateLinkAccount.fulfilled, (state, action) => {
      const newData = action.payload
      state.linking = false
      if (newData) {
        state.data.linkedAccounts = [] // prevent duplicate
        _.merge(state.data, newData)
      }
    })
    builder.addCase(deleteLinkAccount.fulfilled, (state, action) => {
      const newData = action.payload
      if (newData) {
        state.data.linkedAccounts = [] // prevent duplicate
        _.merge(state.data, newData)
      }
    })
    builder.addCase(fetchUserStatus.fulfilled, (state, action) => {
      state.statusData = action.payload
    })
  },
})

export const { setFetched, clearData } = slice.actions
export const userReducer = slice.reducer
