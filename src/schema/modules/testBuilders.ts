declare var execute: any

export const createUser = async (values = {}) => {
  const defaultValues = {
    name: "example",
    email: "example@email.com",
    password: "password"
  }
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

export const updateTeam = async (id, data, context) => {
  const result = await execute(
    `
      mutation UpdateTeam($id: Int!, $data: TeamInput!){
        updateTeam(id: $id, data: $data) {
          id
          initials
          name
        }
      }
    `,
    { id, data },
    context
  )

  return result.updateTeam
}
