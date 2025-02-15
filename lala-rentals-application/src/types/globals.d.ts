export {}

// Create a type for the roles
export type Roles = 'host' | 'renter'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}