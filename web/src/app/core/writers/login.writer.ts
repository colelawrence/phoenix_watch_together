import { Injectable } from '@angular/core';
import { Facebook } from 'ionic-native';

import { DeviceStateService } from '../device-state.service'
import * as R from '../../shared/read'

@Injectable()
export class LoginWriter {

  // We can add more permissions here as necessary later on
  private _permissions: string[] = ['public_profile']
  static CONNECTED = 'connected'
  static NOT_AUTH = 'not_authorized'
  static UNKNOWN = 'unknown' // currently unused, but keeping here just in case

  constructor(private _dss: DeviceStateService) {}

  /**Checks for the current login status on the device.
   * If the user is already logged in, then it will pass them on to the next screen.
   * Otherwise, it will perform a login attempt to receive permissions.
   * Calls <<_login>>.
   * This will update the state if an error occurs while requesting the login status.
   */
  attemptLogin() {
    // Check the login status of the user
    Facebook.getLoginStatus()
      .then((responseSuccess) => {
        // console.log('getLoginStatus response:') // DEBUG
        // console.log(responseSuccess) // DEBUG
        switch (responseSuccess.status) {
          case LoginWriter.CONNECTED:
            // user is already logged in; update the state to ensure this is registered
            this._dss.updateState({LoggedIn: true})
            break
          case LoginWriter.NOT_AUTH:
            // user is logged in to Facebook, but hasn't authorized the app
            this._login()
            break
          default: // technically, case this.UNKNOWN, but also handles other unexpected responses
            // user is either not logged in, or logged out; need to login
            this._login()
        }
      })
      .catch((responseFailure) => {
        // console.log('response:') // DEBUG
        // console.log(responseFailure) // DEBUG
        // update the state to display the error
        this._dss.updateState({
          NotLoggedIn: {
            HasLoggedOutShown: false,
            LoginError: responseFailure.toString()
          }
        })
      })
  }

  /**Makes the login call to Facebook.
   * This requests a Facebook dialog to pop up within the app for logging in.
   * This will update the state if an error occurs while logging in.
   */
  private _login() {
    Facebook.login(this._permissions)
      .then((responseSuccess) => {
        // console.log('Login response:') // DEBUG
        // console.log(responseSuccess) // DEBUG
        // translate the server's response to the internal storage
        let auth = responseSuccess.authResponse
        const credentials: R.FacebookAuth = {
          AccessToken: auth.accessToken,
          ExpiresIn: auth.expiresIn,
          Signature: auth.sig,
          SessionKey: auth.session_key,
          UserID: auth.userID
        }
        // Update the FacebookAuth device state with the returned credentials
        this._dss.updateState({ HasLoggedIn: true, LoggedIn: { Credentials: credentials } })
      })
      .catch((responseFailure) => {
        // console.log('Error:') // DEBUG
        // console.log(responseFailure) // DEBUG
        this._dss.updateState({
          NotLoggedIn: {
            HasLoggedOutShown: false,
            LoginError: 'Could not log in to Facebook- please try again.'
          }
        })
      })
  }

  /**Logs the user out of the app.
   * Updates the state on a successful logout.
   * This will update the state if an error occurs while logging out.
   */
  logout() {
    Facebook.logout()
      .then(() => {
        this._dss.updateState({
          HasLoggedIn: false,
          NotLoggedIn: {
            HasLoggedOutShown: true
          }
        })
      })
      .catch((responseError) => {
        // Do something to report the failure to the user
        // For now, report to the console
        console.error('An error occured while logging out.', responseError)
      })
  }
}
