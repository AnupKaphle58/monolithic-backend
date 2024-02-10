import { RouterClass } from "@src/classes";
import { AuthController } from "@src/controllers";
import exceptionHandler from "@src/middlewares/exceptionHandler";


export class AuthRouter extends RouterClass {
  constructor() {
    super();
  }

  define(): void {
    this.router
      .route("/sign-up")
      .post(
        exceptionHandler(AuthController.signUp)
      );

    this.router
      .route("/log-in")
      .post(
        exceptionHandler(AuthController.logIn)
      );

    this.router
      .route("/auth-me")
      .get(
        exceptionHandler(AuthController.authMe)
      );
    this.router
      .route("/confirm-signup")
      .post(
        exceptionHandler(AuthController.confirmSignUp)
      );
    this.router
      .route("/resend-confirmation-code")
      .post(
        exceptionHandler(AuthController.resendConfirmationCode)
      );
    this.router
      .route("/forgot-password")
      .post(
        exceptionHandler(AuthController.forgotPassword)
      );
  }
}
