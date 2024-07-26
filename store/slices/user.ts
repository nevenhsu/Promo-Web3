import * as _ from 'lodash-es'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getUserInfo,
  updateUser as _updateUser,
  updateLinkAccount as _updateLinkAccount,
  deleteLinkAccount as _deleteLinkAccount,
} from '@/services/user'
import { getUserStatus } from '@/services/userStatus'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { TUser, LinkedAccount } from '@/models/user'
import type { TUserStatus } from '@/models/userStatus'

export const fetchUser = createAsyncThunk<Partial<TUser>>('user/fetch', async () => {
  try {
    const data = await getUserInfo()
    return data || {}
  } catch (err) {
    console.error(err)
    return {}
  }
})

export const fetchUserStatus = createAsyncThunk<TUserStatus>('user/fetchStatus', async () => {
  const data = await getUserStatus()
  return data
})

export const updateUser = createAsyncThunk<Partial<TUser>, Partial<TUser>>(
  'user/update',
  async data => {
    try {
      const updateData = await _updateUser(data)
      return updateData || {}
    } catch (err) {
      console.error(err)
      return {}
    }
  }
)

export const updateLinkAccount = createAsyncThunk<Partial<TUser>, LinkedAccount>(
  '/user/linkAccount',
  async data => {
    const { userId, platform, username } = data
    try {
      const user = await _updateLinkAccount(userId, platform, username || '')
      return user
    } catch (err) {
      console.error(err)
      return {}
    }
  }
)

export const deleteLinkAccount = createAsyncThunk<Partial<TUser>, string>(
  'user/deleteLinkAccount',
  async platform => {
    try {
      const user = await _deleteLinkAccount(platform)
      return user
    } catch (err) {
      console.error(err)
      return {}
    }
  }
)

export interface IUserState {
  _id: string
  fetched: boolean
  updating: boolean // for update user
  linking: boolean // for link account
  data: Partial<TUser>
  status?: TUserStatus
}

const initialState: IUserState = {
  _id: '',
  fetched: false,
  updating: false,
  linking: false,
  data: {},
  status: undefined,
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
      const data = action.payload
      state.data = data
      state._id = data._id || ''
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
      state.status = action.payload
    })
  },
})

export const { setFetched, clearData } = slice.actions
export const userReducer = slice.reducer
