import UsersHeader from './components/UsersHeader'
import UsersTable from './components/UsersTable'

function Users() {
  return (
    <section className="flex flex-col gap-4 px-4 py-2 sm:px-6 lg:px-8">
      <UsersHeader />
      <UsersTable />
    </section>
  )
}

export default Users
