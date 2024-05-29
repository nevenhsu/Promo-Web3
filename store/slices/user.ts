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
        updateState(state, newData)
      }
    })
  },
})

export const { setFetched } = slice.actions
export const userReducer = slice.reducer

function updateState(state: IUserState, body: Partial<TUser>) {
  const merged = _.merge({}, state.data, body)
  _.forEach(merged, (value, key) => {
    // @ts-ignore
    state.data[key] = value
  })
}
