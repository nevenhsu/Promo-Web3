import * as _ from 'lodash-es'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface IWalletState {
  walletLoading: boolean
  onSmartAccount: boolean // zerodev
  walletClientType: string
}

const initialState: IWalletState = {
  walletLoading: false,
  onSmartAccount: true,
  walletClientType: 'zerodev',
}

export const slice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletClientType: (state, action: PayloadAction<string>) => {
      const value = action.payload
      state.walletClientType = value

      if (value === 'zerodev') {
        state.onSmartAccount = true
      } else {
        state.onSmartAccount = false
      }
    },
    setWalletLoading: (state, action: PayloadAction<boolean>) => {
      state.walletLoading = action.payload
    },
  },
})

export const { setWalletClientType, setWalletLoading } = slice.actions
export const walletReducer = slice.reducer
