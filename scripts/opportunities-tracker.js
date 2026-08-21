const trackerFallbackOpportunities = [];

function initOpportunitiesTracker() {
  const search = document.getElementById("opportunity-search");
  const filters = document.querySelectorAll("[data-tracker-filter]");
  const grid = document.getElementById("opportunity-grid");
  const trackerBoard = document.querySelector(".tracker-board");
  const trackerShell = document.querySelector(".tracker-shell");
  const count = document.getElementById("opportunity-count");
  const countLabel = document.getElementById("opportunity-count-label");
  const empty = document.getElementById("opportunity-empty");
  const opportunityDetailDialog = document.getElementById("opportunity-detail-dialog");
  const opportunityDetailContent = document.getElementById("opportunity-detail-content");
  const pagination = document.getElementById("tracker-pagination");
  const previousPageButton = document.getElementById("tracker-page-previous");
  const nextPageButton = document.getElementById("tracker-page-next");
  const pageStatus = document.getElementById("tracker-page-status");
  const clearFiltersButton = document.getElementById("tracker-clear-filters");
  const dialog = document.getElementById("member-access-dialog");
  const signInView = document.getElementById("member-sign-in-view");
  const signInForm = document.getElementById("member-sign-in-form");
  const forgotPasswordButton = document.getElementById("member-forgot-password");
  const recoveryView = document.getElementById("member-recovery-view");
  const recoveryForm = document.getElementById("member-recovery-form");
  const returnToSignInButton = document.getElementById("member-return-to-sign-in");
  const recoveryStatus = document.getElementById("member-recovery-status");
  const accessStatus = document.getElementById("member-access-status");
  const accountButton = document.getElementById("tracker-account-button");
  const workspace = document.getElementById("tracker-workspace");
  const browseOpportunitiesButton = document.getElementById("tracker-browse-opportunities");
  const signedInAs = document.getElementById("tracker-signed-in-as");
  const signOutButton = document.getElementById("tracker-sign-out");
  const changePasswordButton = document.getElementById("tracker-change-password");
  const passwordDialog = document.getElementById("tracker-password-dialog");
  const passwordTitle = document.getElementById("tracker-password-title");
  const passwordCopy = document.getElementById("tracker-password-copy");
  const passwordForm = document.getElementById("tracker-password-form");
  const passwordStatus = document.getElementById("tracker-password-status");
  const temporaryPasswordDialog = document.getElementById("tracker-temporary-password-dialog");
  const temporaryPasswordEmail = document.getElementById("tracker-temporary-password-email");
  const temporaryPasswordForm = document.getElementById("tracker-temporary-password-form");
  const temporaryPasswordStatus = document.getElementById("tracker-temporary-password-status");
  const workspaceTabs = document.querySelectorAll("[data-workspace-view]");
  const submitPanel = document.getElementById("tracker-submit-panel");
  const managementPanel = document.getElementById("tracker-management-panel");
  const membersPanel = document.getElementById("tracker-members-panel");
  const manageButton = document.getElementById("tracker-manage-button");
  const membersButton = document.getElementById("tracker-members-button");
  const submissionForm = document.getElementById("opportunity-submission-form");
  const submissionStatus = document.getElementById("submission-status");
  const managementList = document.getElementById("tracker-management-list");
  const managementStatus = document.getElementById("tracker-management-status");
  const managementSearch = document.getElementById("tracker-management-search");
  const memberForm = document.getElementById("tracker-member-form");
  const membersList = document.getElementById("tracker-members-list");
  const membersStatus = document.getElementById("tracker-members-status");
  const config = window.IHSAAN_SUPABASE_CONFIG || {};
  const adminFunctionName = config.adminFunctionName || "tracker-admin";
  const isConfigured = /^https:\/\//.test(config.url || "") && Boolean(config.publishableKey);
  const client = isConfigured && window.supabase
    ? window.supabase.createClient(config.url, config.publishableKey, { auth: { flowType: "pkce", detectSessionInUrl: true } })
    : null;
  let selectedFilter = "all";
  let currentPage = 1;
  const pageSize = 9;
  let opportunities = [...trackerFallbackOpportunities];
  let managementOpportunities = [];
  let trackerRole = null;
  let currentUser = null;

  if (!search || !grid || !count || !empty) return;

  const escapeHtml = (value) => String(value || "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[character]));

  const safeUrl = (value) => {
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "#";
    } catch {
      return "#";
    }
  };

  const isTrackerEditor = () => ["editor", "admin"].includes(trackerRole);
  const isTrackerAdmin = () => trackerRole === "admin";
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const invokeAdminFunction = async (body) => {
    const { data: { session } } = await client.auth.getSession();
    if (!session) return { data: null, error: new Error("Your session has expired. Please sign in again.") };
    try {
      const response = await fetch(`${config.url}/functions/v1/${adminFunctionName}`, {
        method: "POST",
        headers: {
          apikey: config.publishableKey,
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      const payload = await response.json();
      if (!response.ok) return { data: null, error: new Error(payload.error || `Request failed (${response.status})`) };
      return { data: payload, error: null };
    } catch {
      return { data: null, error: new Error("Could not reach the secure admin service.") };
    }
  };

  const formatDeadline = (value) => {
    if (!value) return "No closing date listed";
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const opportunityMarkup = (opportunity, index) => {
    const initials = (opportunity.organisation_name || "IHSAAN").trim().charAt(0).toUpperCase();
    const colours = ["blue", "gold", "lilac", "coral", "green", "ink"];
    const deadline = opportunity.deadline ? `<span class="opportunity-card-deadline">Closes ${escapeHtml(formatDeadline(opportunity.deadline))}</span>` : "";
    return `<article class="opportunity-card">
      <div class="opportunity-card-top"><span class="opportunity-type">${escapeHtml(opportunity.opportunity_type)}</span>${deadline}</div>
      <div class="opportunity-card-identity"><div class="opportunity-mark opportunity-mark--${colours[index % colours.length]}" aria-hidden="true">${escapeHtml(initials)}</div><div><h3>${escapeHtml(opportunity.title)}</h3><p class="opportunity-company">${escapeHtml(opportunity.organisation_name)}</p></div></div>
      <p class="opportunity-summary">${escapeHtml(opportunity.description || "Open opportunity. View the details to find out more.")}</p>
      <dl class="opportunity-details"><div><dt>Location</dt><dd>${escapeHtml(opportunity.location)}</dd></div><div><dt>Working style</dt><dd>${escapeHtml(opportunity.work_location_type)}</dd></div><div><dt>Industry</dt><dd>${escapeHtml(opportunity.industry)}</dd></div><div><dt>Pay</dt><dd>${escapeHtml(opportunity.salary || opportunity.remuneration)}</dd></div></dl>
      <div class="opportunity-card-actions"><button class="opportunity-detail-action" type="button" data-opportunity-id="${escapeHtml(opportunity.id)}">View details <span aria-hidden="true">→</span></button>${opportunity.application_url ? `<a class="opportunity-apply-link" href="${safeUrl(opportunity.application_url)}" target="_blank" rel="noopener">Apply</a>` : ""}</div>
    </article>`;
  };

  const detailSection = (title, value) => value ? `<section class="opportunity-detail-section"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(value).replace(/\n/g, "<br>")}</p></section>` : "";

  const openOpportunityDetails = (opportunity) => {
    if (!opportunityDetailContent) return;
    const details = [
      ["Location", opportunity.location],
      ["Working style", opportunity.work_location_type],
      ["Salary", opportunity.salary || opportunity.remuneration],
      ["Deadline", opportunity.deadline ? formatDeadline(opportunity.deadline) : null]
    ].filter(([, value]) => value);
    opportunityDetailContent.innerHTML = `<header class="opportunity-detail-header"><p class="tracker-kicker">${escapeHtml(opportunity.opportunity_type)} · ${escapeHtml(opportunity.industry)}</p><div class="opportunity-detail-heading"><div class="opportunity-mark opportunity-mark--blue" aria-hidden="true">${escapeHtml((opportunity.organisation_name || "IHSAAN").trim().charAt(0).toUpperCase())}</div><div><h2 id="opportunity-detail-title">${escapeHtml(opportunity.title)}</h2><p>${escapeHtml(opportunity.organisation_name)}</p></div></div></header><dl class="opportunity-detail-meta">${details.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl><div class="opportunity-detail-body">${detailSection("About the organisation", opportunity.about_organisation)}${detailSection("Opportunity overview", opportunity.description)}${detailSection("Requirements", opportunity.requirements)}${detailSection("Application process", opportunity.application_process)}</div>${opportunity.application_url ? `<a class="opportunity-detail-apply" href="${safeUrl(opportunity.application_url)}" target="_blank" rel="noopener">View application <span aria-hidden="true">→</span></a>` : '<p class="opportunity-detail-pending">Application details are coming soon.</p>'}`;
    opportunityDetailDialog?.showModal();
  };

  const updateResults = () => {
    const query = search.value.trim().toLowerCase();
    const visible = opportunities.filter((opportunity) => {
      const searchable = [opportunity.title, opportunity.organisation_name, opportunity.opportunity_type, opportunity.industry, opportunity.location, opportunity.work_location_type].join(" ").toLowerCase();
      return (selectedFilter === "all" || opportunity.opportunity_type === selectedFilter) && searchable.includes(query);
    });
    const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
    if (currentPage > pageCount) currentPage = pageCount;
    const pageItems = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    grid.innerHTML = pageItems.map((opportunity, index) => opportunityMarkup(opportunity, index)).join("");
    count.textContent = String(visible.length);
    countLabel.textContent = visible.length === 1 ? "opportunity" : "opportunities";
    empty.hidden = visible.length !== 0;
    if (clearFiltersButton) clearFiltersButton.hidden = selectedFilter === "all" && !query;
    if (pagination) pagination.hidden = visible.length <= pageSize;
    if (pageStatus) pageStatus.textContent = `Page ${currentPage} of ${pageCount}`;
    if (previousPageButton) previousPageButton.disabled = currentPage === 1;
    if (nextPageButton) nextPageButton.disabled = currentPage === pageCount;
  };

  const loadOpportunities = async () => {
    if (!client) return updateResults();
    grid.innerHTML = '<p class="tracker-loading">Loading opportunities…</p>';
    const { data, error } = await client
      .from("opportunities")
      .select("id, title, organisation_name, opportunity_type, industry, location, work_location_type, remuneration, application_url, description, about_organisation, salary, deadline, requirements, application_process, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error) {
      grid.innerHTML = '<p class="tracker-loading">The tracker is being connected. Please check back shortly.</p>';
      count.textContent = "0";
      countLabel.textContent = "opportunities";
      return;
    }
    opportunities = data;
    updateResults();
  };

  const showSignIn = (message = "") => {
    signInView.hidden = false;
    if (recoveryView) recoveryView.hidden = true;
    accessStatus.textContent = message;
  };

  const showRecovery = () => {
    signInView.hidden = true;
    if (recoveryView) recoveryView.hidden = false;
    recoveryForm?.reset();
    if (recoveryStatus) recoveryStatus.textContent = "";
  };

  const showPasswordDialog = (recovery = false) => {
    passwordForm?.reset();
    passwordStatus.textContent = "";
    if (passwordTitle) passwordTitle.textContent = recovery ? "Set a new password" : "Choose a new password";
    if (passwordCopy) passwordCopy.textContent = recovery
      ? "Your reset link has been verified. Choose a new password to regain access."
      : "Use a strong password that you do not use elsewhere.";
    passwordDialog?.showModal();
  };

  const getTrackerRole = async () => {
    const { data: role, error } = await client.rpc("current_tracker_role");
    return error ? null : role;
  };

  const updateAccountControls = () => {
    if (accountButton) accountButton.textContent = currentUser && trackerRole ? "Open contributor workspace" : "Sign in to manage";
    if (signedInAs) signedInAs.textContent = currentUser && trackerRole ? `Signed in as ${currentUser.email} · ${trackerRole}` : "";
    if (manageButton) manageButton.hidden = !isTrackerEditor();
    if (membersButton) membersButton.hidden = !isTrackerAdmin();
    if (!trackerRole) {
      if (workspace) workspace.hidden = true;
      if (trackerShell) trackerShell.hidden = false;
    }
  };

  const refreshAccountState = async () => {
    if (!client) return;
    const { data: { user } } = await client.auth.getUser();
    currentUser = user;
    trackerRole = user ? await getTrackerRole() : null;
    updateAccountControls();
    if (user && new URLSearchParams(window.location.search).get("trackerRecovery") === "1") {
      dialog?.close();
      showPasswordDialog(true);
      window.history.replaceState({}, "", `${window.location.pathname}#opportunities-tracker`);
    }
  };

  const setWorkspaceView = async (view = "submit") => {
    if (!trackerRole) return;
    const panels = { submit: submitPanel, manage: managementPanel, members: membersPanel };
    Object.entries(panels).forEach(([name, panel]) => { if (panel) panel.hidden = name !== view; });
    workspaceTabs.forEach((tab) => {
      const active = tab.dataset.workspaceView === view;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    if (view === "manage") await loadManagement();
    if (view === "members") await loadMembers();
  };

  const showWorkspace = async (view = "submit") => {
    if (!workspace || !trackerRole) return;
    workspace.hidden = false;
    if (trackerShell) trackerShell.hidden = true;
    await setWorkspaceView(view);
    workspace.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showOpportunities = () => {
    if (workspace) workspace.hidden = true;
    if (trackerShell) trackerShell.hidden = false;
    trackerShell?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openAccount = async () => {
    if (!client) {
      dialog?.showModal();
      showSignIn("Secure contributor access is being connected. Please check back shortly.");
      return;
    }
    await refreshAccountState();
    if (trackerRole) return showWorkspace();
    dialog?.showModal();
    showSignIn(currentUser ? "This signed-in account has not been authorised for tracker access." : "");
  };

  const managerFormMarkup = (opportunity) => `<article class="tracker-management-item" data-management-item="${escapeHtml(opportunity.id)}">
    <div class="tracker-management-summary">
      <div><p>${escapeHtml(opportunity.opportunity_type)}</p><h3>${escapeHtml(opportunity.title)}</h3><span>${escapeHtml(opportunity.organisation_name)} · ${escapeHtml(opportunity.location)}</span></div>
      <button class="tracker-member-save" type="button" data-edit-opportunity aria-expanded="false">Edit details</button>
    </div>
    <form class="tracker-management-form" data-opportunity-id="${escapeHtml(opportunity.id)}" hidden>
    <div class="tracker-management-fields">
      <label>Role title<input name="title" value="${escapeHtml(opportunity.title)}" required></label>
      <label>Firm name<input name="organisation_name" value="${escapeHtml(opportunity.organisation_name)}" required></label>
      <label>Role type<select name="opportunity_type" required>${["Internship", "Graduate role", "Scholarship", "Apprenticeship", "Full-time", "Part-time", "Freelance", "Volunteering", "Programme", "Other"].map((type) => `<option${type === opportunity.opportunity_type ? " selected" : ""}>${type}</option>`).join("")}</select></label>
      <label>Industry<input name="industry" value="${escapeHtml(opportunity.industry)}" required></label>
      <label>Location<input name="location" value="${escapeHtml(opportunity.location)}" required></label>
      <label>Work location<select name="work_location_type" required>${["On-site", "Hybrid", "Remote", "Not specified"].map((type) => `<option${type === opportunity.work_location_type ? " selected" : ""}>${type}</option>`).join("")}</select></label>
      <label>Remuneration<select name="remuneration" required>${["Paid", "Stipend provided", "Unpaid", "Not specified"].map((type) => `<option${type === opportunity.remuneration ? " selected" : ""}>${type}</option>`).join("")}</select></label>
      <label>Application link<input name="application_url" type="url" value="${escapeHtml(opportunity.application_url || "")}" placeholder="Optional"></label>
      <label class="submission-full-width">Description<textarea name="description" rows="3" required>${escapeHtml(opportunity.description)}</textarea></label>
      <label>Salary or compensation<input name="salary" value="${escapeHtml(opportunity.salary || "")}" placeholder="Optional"></label>
      <label>Application deadline<input name="deadline" type="date" value="${escapeHtml(opportunity.deadline || "")}"></label>
      <label class="submission-full-width">About the organisation<textarea name="about_organisation" rows="3" placeholder="Optional">${escapeHtml(opportunity.about_organisation || "")}</textarea></label>
      <label class="submission-full-width">Requirements<textarea name="requirements" rows="3" placeholder="Optional">${escapeHtml(opportunity.requirements || "")}</textarea></label>
      <label class="submission-full-width">Application process<textarea name="application_process" rows="3" placeholder="Optional">${escapeHtml(opportunity.application_process || "")}</textarea></label>
    </div>
    <div class="tracker-management-actions"><button class="member-primary-action" type="submit">Save changes</button><button class="tracker-remove-action" type="button" data-delete-opportunity>Remove opportunity</button></div>
    </form>
  </article>`;

  const renderManagement = () => {
    if (!managementList) return;
    const query = managementSearch?.value.trim().toLowerCase() || "";
    const visible = managementOpportunities.filter((opportunity) => [opportunity.title, opportunity.organisation_name, opportunity.opportunity_type, opportunity.industry, opportunity.location].join(" ").toLowerCase().includes(query));
    managementList.innerHTML = visible.length
      ? visible.map(managerFormMarkup).join("")
      : `<p class="tracker-loading">${managementOpportunities.length ? "No listings match that search." : "There are no opportunities to manage yet."}</p>`;
  };

  const loadManagement = async () => {
    if (!client || !isTrackerEditor() || !managementList) return;
    managementStatus.textContent = "";
    managementList.innerHTML = '<p class="tracker-loading">Loading opportunities…</p>';
    const { data, error } = await client.from("opportunities").select("id, title, organisation_name, opportunity_type, industry, location, work_location_type, remuneration, application_url, description, about_organisation, salary, deadline, requirements, application_process, created_at").order("created_at", { ascending: false });
    if (error) {
      managementList.innerHTML = "";
      managementStatus.textContent = "We could not load the management list.";
      return;
    }
    managementOpportunities = data;
    renderManagement();
  };

  const memberFormMarkup = (member) => {
    const ownAccount = member.email === currentUser?.email?.toLowerCase();
    const passwordAction = ownAccount
      ? '<span class="tracker-own-password-note">Use Change password</span>'
      : '<button class="tracker-member-save" type="button" data-reset-password>Set new password</button>';
    const removeAction = ownAccount ? "" : '<button class="tracker-remove-member" type="button" data-remove-member>Remove access</button>';
    return `<form class="tracker-member-row" data-member-email="${escapeHtml(member.email)}">
    <strong>${escapeHtml(member.email)}</strong>
    <label><span class="sr-only">Access level for ${escapeHtml(member.email)}</span><select name="role"><option value="member"${member.role === "member" ? " selected" : ""}>Contributor</option><option value="editor"${member.role === "editor" ? " selected" : ""}>Editor</option><option value="admin"${member.role === "admin" ? " selected" : ""}>Admin</option></select></label>
    <label class="tracker-member-active"><input name="active" type="checkbox"${member.active ? " checked" : ""}> Active</label>
    <button class="tracker-member-save" type="submit">Save</button>${passwordAction}${removeAction}
  </form>`;
  };

  const showTemporaryPassword = (email) => {
    temporaryPasswordEmail.textContent = email;
    temporaryPasswordForm?.reset();
    temporaryPasswordStatus.textContent = "";
    temporaryPasswordDialog?.showModal();
  };

  const loadMembers = async () => {
    if (!client || !isTrackerAdmin() || !membersList) return;
    membersList.innerHTML = '<p class="tracker-loading">Loading access list…</p>';
    const { data, error } = await client.from("tracker_members").select("email, role, active, created_at").order("email");
    if (error) {
      membersList.innerHTML = "";
      membersStatus.textContent = "We could not load the access list.";
      return;
    }
    membersList.innerHTML = data.length ? data.map(memberFormMarkup).join("") : '<p class="tracker-loading">No contributor emails have been authorised yet.</p>';
  };

  search.addEventListener("input", () => { currentPage = 1; updateResults(); });
  clearFiltersButton?.addEventListener("click", () => {
    search.value = "";
    selectedFilter = "all";
    currentPage = 1;
    filters.forEach((filter) => filter.classList.toggle("is-active", filter.dataset.trackerFilter === "all"));
    updateResults();
    search.focus();
  });
  managementSearch?.addEventListener("input", renderManagement);
  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-opportunity-id]");
    if (!button) return;
    const opportunity = opportunities.find((item) => item.id === button.dataset.opportunityId);
    if (opportunity) openOpportunityDetails(opportunity);
  });
  document.querySelectorAll("[data-opportunity-detail-close]").forEach((button) => button.addEventListener("click", () => opportunityDetailDialog?.close()));
  filters.forEach((filter) => filter.addEventListener("click", () => {
    selectedFilter = filter.dataset.trackerFilter;
    currentPage = 1;
    filters.forEach((item) => item.classList.toggle("is-active", item === filter));
    updateResults();
  }));
  previousPageButton?.addEventListener("click", () => { if (currentPage > 1) { currentPage -= 1; updateResults(); trackerBoard?.scrollIntoView({ behavior: "smooth", block: "start" }); } });
  nextPageButton?.addEventListener("click", () => { currentPage += 1; updateResults(); trackerBoard?.scrollIntoView({ behavior: "smooth", block: "start" }); });
  accountButton?.addEventListener("click", openAccount);
  browseOpportunitiesButton?.addEventListener("click", showOpportunities);
  document.querySelectorAll("[data-dialog-close]").forEach((button) => button.addEventListener("click", () => dialog?.close()));
  workspaceTabs.forEach((tab) => tab.addEventListener("click", () => setWorkspaceView(tab.dataset.workspaceView)));
  forgotPasswordButton?.addEventListener("click", showRecovery);
  returnToSignInButton?.addEventListener("click", () => showSignIn());

  signInForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!client) return;
    const email = document.getElementById("member-email").value.trim();
    const password = document.getElementById("member-password").value;
    const button = signInForm.querySelector("button");
    button.disabled = true;
    accessStatus.textContent = "Signing you in…";
    const { error } = await client.auth.signInWithPassword({ email, password });
    button.disabled = false;
    if (!error) {
      await refreshAccountState();
      if (trackerRole) {
        dialog?.close();
        await showWorkspace();
      } else {
        showSignIn("This email is signed in but has not been authorised for the tracker.");
      }
      return;
    }
    accessStatus.textContent = error.message.toLowerCase().includes("invalid login credentials")
      ? "That email or password is not recognised."
      : "We could not sign you in. Please try again.";
  });

  recoveryForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!client) return;
    const email = document.getElementById("member-recovery-email").value.trim();
    const button = recoveryForm.querySelector("button");
    button.disabled = true;
    recoveryStatus.textContent = "Sending secure reset link…";
    const redirectTo = `${window.location.origin}${window.location.pathname}?trackerRecovery=1#opportunities-tracker`;
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
    button.disabled = false;
    recoveryStatus.textContent = error
      ? "We could not send the reset link. Please try again or ask a tracker administrator for help."
      : "If that email has a tracker account, a secure IHSAAN reset link is on its way.";
  });

  signOutButton?.addEventListener("click", async () => {
    await client?.auth.signOut();
    currentUser = null;
    trackerRole = null;
    updateAccountControls();
    showOpportunities();
  });

  changePasswordButton?.addEventListener("click", () => showPasswordDialog());
  document.querySelectorAll("[data-password-close]").forEach((button) => button.addEventListener("click", () => passwordDialog?.close()));
  document.querySelectorAll("[data-temporary-password-close]").forEach((button) => button.addEventListener("click", () => temporaryPasswordDialog?.close()));
  temporaryPasswordForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = document.getElementById("tracker-temporary-new-password").value;
    const confirmation = document.getElementById("tracker-temporary-confirm-password").value;
    if (password !== confirmation) {
      temporaryPasswordStatus.textContent = "The passwords do not match.";
      return;
    }
    const button = temporaryPasswordForm.querySelector("button");
    button.disabled = true;
    temporaryPasswordStatus.textContent = "Saving new password…";
    const { error } = await invokeAdminFunction({ action: "reset_contributor_password", email: temporaryPasswordEmail.textContent, password });
    button.disabled = false;
    temporaryPasswordStatus.textContent = error ? error.message : "Password saved. Share it privately, then ask them to change it after signing in.";
    if (!error) window.setTimeout(() => temporaryPasswordDialog?.close(), 900);
  });
  passwordForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = document.getElementById("tracker-new-password").value;
    const confirmation = document.getElementById("tracker-confirm-password").value;
    if (password !== confirmation) {
      passwordStatus.textContent = "The passwords do not match.";
      return;
    }
    const button = passwordForm.querySelector("button");
    button.disabled = true;
    passwordStatus.textContent = "Saving new password…";
    const { error } = await client.auth.updateUser({ password });
    button.disabled = false;
    passwordStatus.textContent = error ? "We could not update the password. Please try again." : "Password updated.";
    if (!error) window.setTimeout(() => passwordDialog?.close(), 800);
  });

  submissionForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!client || !currentUser) return;
    const button = submissionForm.querySelector("button");
    button.disabled = true;
    submissionStatus.textContent = "Publishing opportunity…";
    const opportunity = Object.fromEntries(new FormData(submissionForm).entries());
    ["application_url", "about_organisation", "salary", "deadline", "requirements", "application_process"].forEach((field) => { if (!opportunity[field]?.trim()) opportunity[field] = null; });
    const { error } = await client.from("opportunities").insert({ ...opportunity, submitted_by: currentUser.id, status: "approved" });
    button.disabled = false;
    if (error) {
      submissionStatus.textContent = "We could not add this opportunity. Please check every required field and try again.";
      return;
    }
    submissionForm.reset();
    submissionStatus.textContent = "Published. This opportunity is now visible on the tracker.";
    await loadOpportunities();
  });

  managementList?.addEventListener("submit", async (event) => {
    const form = event.target.closest(".tracker-management-form");
    if (!form) return;
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    const values = Object.fromEntries(new FormData(form).entries());
    ["application_url", "about_organisation", "salary", "deadline", "requirements", "application_process"].forEach((field) => { if (!values[field]?.trim()) values[field] = null; });
    button.disabled = true;
    managementStatus.textContent = "Saving changes…";
    const { error } = await client.from("opportunities").update(values).eq("id", form.dataset.opportunityId);
    button.disabled = false;
    if (error) {
      managementStatus.textContent = "We could not save those changes. Please check the fields and try again.";
      return;
    }
    managementStatus.textContent = "Changes saved.";
    await loadManagement();
    await loadOpportunities();
  });

  managementList?.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-opportunity]");
    if (editButton) {
      const item = editButton.closest("[data-management-item]");
      const form = item?.querySelector(".tracker-management-form");
      if (!form) return;
      const opening = form.hidden;
      managementList.querySelectorAll(".tracker-management-form").forEach((otherForm) => { otherForm.hidden = true; });
      managementList.querySelectorAll("[data-edit-opportunity]").forEach((otherButton) => {
        otherButton.setAttribute("aria-expanded", "false");
        otherButton.textContent = "Edit details";
      });
      form.hidden = !opening;
      editButton.setAttribute("aria-expanded", String(opening));
      editButton.textContent = opening ? "Close editor" : "Edit details";
      if (opening) window.setTimeout(() => form.scrollIntoView({ behavior: "smooth", block: "nearest" }), 0);
      return;
    }
    const button = event.target.closest("[data-delete-opportunity]");
    if (!button) return;
    const form = button.closest(".tracker-management-form");
    if (!window.confirm("Remove this opportunity from the tracker?")) return;
    button.disabled = true;
    managementStatus.textContent = "Removing opportunity…";
    const { error } = await client.from("opportunities").delete().eq("id", form.dataset.opportunityId);
    if (error) {
      button.disabled = false;
      managementStatus.textContent = "We could not remove this opportunity. Please try again.";
      return;
    }
    managementStatus.textContent = "Opportunity removed.";
    await loadManagement();
    await loadOpportunities();
  });

  memberForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(memberForm).entries());
    const email = values.email.trim().toLowerCase();
    if (!isValidEmail(email)) {
      membersStatus.textContent = "Enter a valid email address.";
      return;
    }
    const button = memberForm.querySelector("button");
    button.disabled = true;
    membersStatus.textContent = "Authorising contributor…";
    const { error } = await invokeAdminFunction({ action: "create_contributor", email, role: values.role, password: values.password });
    button.disabled = false;
    if (error) {
      membersStatus.textContent = error.message;
      return;
    }
    memberForm.reset();
    membersStatus.textContent = "Access added. Share the password privately, then ask them to use Change password after signing in.";
    await loadMembers();
  });

  membersList?.addEventListener("submit", async (event) => {
    const form = event.target.closest(".tracker-member-row");
    if (!form) return;
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    const button = form.querySelector("button");
    button.disabled = true;
    membersStatus.textContent = "Saving access…";
    const { error } = await invokeAdminFunction({ action: "update_contributor", email: form.dataset.memberEmail, role: values.role, active: values.active === "on" });
    button.disabled = false;
    if (error) {
      membersStatus.textContent = "We could not update that contributor’s access.";
      return;
    }
    membersStatus.textContent = "Access updated.";
    await loadMembers();
  });

  membersList?.addEventListener("click", async (event) => {
    const resetButton = event.target.closest("[data-reset-password]");
    const removeButton = event.target.closest("[data-remove-member]");
    if (!resetButton && !removeButton) return;
    const button = resetButton || removeButton;
    const form = button.closest(".tracker-member-row");
    if (removeButton) {
      if (!window.confirm(`Remove all tracker access for ${form.dataset.memberEmail}?`)) return;
      button.disabled = true;
      membersStatus.textContent = "Removing access…";
      const { error } = await invokeAdminFunction({ action: "remove_contributor", email: form.dataset.memberEmail });
      if (error) {
        button.disabled = false;
        membersStatus.textContent = `We could not remove that access record: ${error.message}`;
        return;
      }
      membersStatus.textContent = "Access removed.";
      await loadMembers();
      return;
    }
    showTemporaryPassword(form.dataset.memberEmail);
  });

  if (client) {
    client.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        dialog?.close();
        showPasswordDialog(true);
        window.history.replaceState({}, "", `${window.location.pathname}#opportunities-tracker`);
      }
      window.setTimeout(refreshAccountState, 0);
    });
    refreshAccountState();
  }
  loadOpportunities();
}
