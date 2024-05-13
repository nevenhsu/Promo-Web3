import * as _ from 'lodash-es'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getUserInfo, updateUser as updateUserAPI } from '@/services/user'
import { UserField } from '@/types/db'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { UpdateUserBody } from '@/services/user'
import type { User } from '@/models/user'

type TUser = Partial<Omit<User, '_id'> & { _id?: string }>

export const fetchUser = createAsyncThunk<TUser>('user/fetch', async () => {
  const fallback = {}
  try {
    const data = await getUserInfo()
    const { _id } = data || {}
    if (_id) {
      return { ...data, _id: _id.toString() }
    }
    return fallback
  } catch (err) {
    console.error(err)
    return fallback
  }
})

export const updateUser = createAsyncThunk<UpdateUserBody | undefined, UpdateUserBody>(
  'user/update',
  async body => {
    const res = await updateUserAPI(body)
    return res
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
    setNewValue: (state, action: PayloadAction<UpdateUserBody>) => {
      const body = action.payload
      updateState(state, body)
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      const data = action.payload
      state.data = data
      state._id = data._id?.toString() || ''
      state.fetched = true
    })
    builder.addCase(updateUser.pending, (state, action) => {
      state.updating = true
    })
    builder.addCase(updateUser.fulfilled, (state, action) => {
      const body = action.payload
      state.updating = false
      if (body) {
        updateState(state, body)
      }
    })
  },
})

export const { setFetched, setNewValue } = slice.actions
export const userReducer = slice.reducer

function updateState(state: IUserState, body: UpdateUserBody) {
  const { field, value } = body
  switch (field) {
    case UserField.name:
    case UserField.username:
      state.data[field] = value
      break

    // details
    case UserField.about:
    case UserField.links:
    case UserField.avatar:
    case UserField.covers: {
      state.data.details = {
        ...state.data.details,
        [field]: value,
      } as any
      break
    }

    default: {
      // throw new Error('invalid field')
    }
  }
}
