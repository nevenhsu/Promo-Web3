import * as _ from 'lodash-es'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getUserInfo, updateUser as updateUserAPI } from '@/services/user'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { TUser } from '@/models/user'

export const fetchUser = createAsyncThunk<Partial<TUser>>('user/fetch', async () => {
  try {
    const data = await getUserInfo()
    return data || {}
  } catch (err) {
    console.error(err)
    return {}
  }
})

export const updateUser = createAsyncThunk<Partial<TUser>, Partial<TUser>>(
  'user/update',
  async data => {
    try {
      const updateData = await updateUserAPI(data)
      return updateData || {}
    } catch (err) {
      console.error(err)
      return {}
    }
  }
)

export interface IUserState {
  _id: string
  fetched: boolean
  updating: boolean
  data: Partial<TUser>
}

const initialState: IUserState = {
  _id: '',
  fetched: false,
  updating: false,
  data: {},
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
      _.merge(state, initialState)
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
        _.merge(state.data, newData)
      }
    })
  },
})

export const { setFetched, clearData } = slice.actions
export const userReducer = slice.reducer
