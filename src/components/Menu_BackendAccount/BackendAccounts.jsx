import AccountTable from "./AccountTable";
import CreateAccountModal from "./CreateAccountModal";

export default function BackendAccounts() {
  return (
    <div>
      <CreateAccountModal />
      <AccountTable />
    </div>
  );
}
