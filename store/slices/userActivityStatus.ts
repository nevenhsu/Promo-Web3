import * as _ from 'lodash-es'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getUserActivityStatus,
  resetUserActivityStatus as _resetUserActivityStatus,
} from '@/services/userActivityStatus'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { TUserActivityStatus } from '@/models/userActivityStatus'

type TUserActivityStatusData = {
  slug: string
  data: TUserActivityStatus | null
}

export const fetchUserActivityStatus = createAsyncThunk<TUserActivityStatusData, string>(
  'userActivityStatus/fetch',
  async slug => {
    const data = await getUserActivityStatus(slug)
    return { data, slug }
  }
)

export const resetUserActivityStatus = createAsyncThunk<TUserActivityStatusData, string>(
  'userActivityStatus/reset',
  async slug => {
    const data = await _resetUserActivityStatus(slug)
    return { data, slug }
  }
)

export interface IUserActivityStatus {
  data: { [slug: string]: TUserActivityStatus | undefined }
  fetched: { [slug: string]: boolean }
  loading: { [slug: string]: boolean }
}

const initialState: IUserActivityStatus = {
  data: {},
  fetched: {},
  loading: {},
}

export const slice = createSlice({
  name: 'userActivityStatus',
  initialState,
  reducers: {
    clearData: state => {
      // for logout
      _.forEach(initialState, (value, key) => {
        // @ts-ignore
        state[key] = value
      })
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUserActivityStatus.pending, (state, action) => {
      state.loading[action.meta.arg] = true
    })
    builder.addCase(fetchUserActivityStatus.rejected, (state, action) => {
      state.loading[action.meta.arg] = false
    })
    builder.addCase(
      fetchUserActivityStatus.fulfilled,
      (state, action: PayloadAction<TUserActivityStatusData>) => {
        const { slug, data } = action.payload
        if (slug) {
          // clear data if no data
          state.data[slug] = data ? data : undefined
          state.fetched[slug] = true
          state.loading[slug] = false
        }
      }
    )
    builder.addCase(resetUserActivityStatus.pending, (state, action) => {
      state.loading[action.meta.arg] = true
    })
    builder.addCase(resetUserActivityStatus.rejected, (state, action) => {
      state.loading[action.meta.arg] = false
    })
    builder.addCase(
      resetUserActivityStatus.fulfilled,
      (state, action: PayloadAction<TUserActivityStatusData>) => {
        const { slug, data } = action.payload
        state.data[slug] = data ? data : undefined
        state.fetched[slug] = true
        state.loading[slug] = false
      }
    )
  },
})

export const { clearData } = slice.actions
export const userActivityStatusReducer = slice.reducer
