declare var execute: any

export const createUser = async (values = {}) => {
  const defaultValues = { email: "example@email.com", password: "password" }
  const data = { ...defaultValues, ...values }
  const result = await execute(
    `
      mutation CreateUser($data: UserInput!){
        createUser(data: $data) {
          id
          email
        }
      }
    `,
    { data }
  )

  return result.createUser
}

export const createTeam = async (data, context) => {
  const result = await execute(
    `
      mutation CreateTeam($data: TeamInput!){
        createTeam(data: $data) {
          id
          initials
          name
        }
      }
    `,
    { data },
    context
  )

  return result.createTeam
}
