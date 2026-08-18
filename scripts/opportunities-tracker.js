const trackerFallbackOpportunities = [];

function initOpportunitiesTracker() {
  const search = document.getElementById("opportunity-search");
  const typeFilter = document.getElementById("opportunity-type-filter");
  const industryFilter = document.getElementById("opportunity-industry-filter");
  const locationFilter = document.getElementById("opportunity-location-filter");
  const workLocationFilter = document.getElementById("opportunity-work-location-filter");
  const remunerationFilter = document.getElementById("opportunity-remuneration-filter");
  const sort = document.getElementById("opportunity-sort");
  const grid = document.getElementById("opportunity-grid");
  const count = document.getElementById("opportunity-count");
  const countLabel = document.getElementById("opportunity-count-label");
  const resultsSummary = document.getElementById("opportunity-results-summary");
  const empty = document.getElementById("opportunity-empty");
  const loadMoreButton = document.getElementById("opportunity-load-more");
  const dialog = document.getElementById("member-access-dialog");
  const signInView = document.getElementById("member-sign-in-view");
  const signInForm = document.getElementById("member-sign-in-form");
  const accessStatus = document.getElementById("member-access-status");
  const accountButton = document.getElementById("tracker-account-button");
  const workspace = document.getElementById("tracker-workspace");
  const signedInAs = document.getElementById("tracker-signed-in-as");
  const signOutButton = document.getElementById("tracker-sign-out");
  const changePasswordButton = document.getElementById("tracker-change-password");
  const passwordDialog = document.getElementById("tracker-password-dialog");
  const passwordForm = document.getElementById("tracker-password-form");
  const passwordStatus = document.getElementById("tracker-password-status");
  const temporaryPasswordDialog = document.getElementById("tracker-temporary-password-dialog");
  const temporaryPasswordEmail = document.getElementById("tracker-temporary-password-email");
  const temporaryPasswordValue = document.getElementById("tracker-temporary-password-value");
  const copyTemporaryPasswordButton = document.getElementById("tracker-copy-temporary-password");
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
  const memberForm = document.getElementById("tracker-member-form");
  const membersList = document.getElementById("tracker-members-list");
  const membersStatus = document.getElementById("tracker-members-status");
  const config = window.IHSAAN_SUPABASE_CONFIG || {};
  const adminFunctionName = config.adminFunctionName || "tracker-admin";
  const isConfigured = /^https:\/\//.test(config.url || "") && Boolean(config.publishableKey);
  const client = isConfigured && window.supabase
    ? window.supabase.createClient(config.url, config.publishableKey, { auth: { flowType: "pkce", detectSessionInUrl: true } })
    : null;
  let opportunities = [...trackerFallbackOpportunities];
  let publicOpportunities = [];
  let totalResults = 0;
  let nextCursor = null;
  let searchRequestVersion = 0;
  let searchTimer = null;
  let serverSearchAvailable = true;
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

  const opportunityMarkup = (opportunity, index) => {
    const initials = (opportunity.organisation_name || "IHSAAN").trim().charAt(0).toUpperCase();
    const colours = ["blue", "gold", "lilac", "coral", "green", "ink"];
    const deadline = opportunity.deadline
      ? `Closes ${new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(`${opportunity.deadline}T00:00:00`))}`
      : "Open";
    const applicationAction = opportunity.application_url
      ? `<a class="opportunity-action" href="${safeUrl(opportunity.application_url)}" target="_blank" rel="noopener">View opportunity <span aria-hidden="true">→</span></a>`
      : '<span class="opportunity-action opportunity-action--unavailable">Application details coming soon</span>';
    return `<article class="opportunity-card">
      <div class="opportunity-card-top"><span class="opportunity-type">${escapeHtml(opportunity.opportunity_type)}</span><span class="opportunity-deadline">${escapeHtml(deadline)}</span></div>
      <div class="opportunity-mark opportunity-mark--${colours[index % colours.length]}" aria-hidden="true">${escapeHtml(initials)}</div>
      <h3>${escapeHtml(opportunity.title)}</h3>
      <p class="opportunity-company">${escapeHtml(opportunity.organisation_name)}</p>
      <dl class="opportunity-details"><div><dt>Industry</dt><dd>${escapeHtml(opportunity.industry)}</dd></div><div><dt>Location</dt><dd>${escapeHtml(opportunity.location)}</dd></div><div><dt>Work location</dt><dd>${escapeHtml(opportunity.work_location_type)}</dd></div><div><dt>Remuneration</dt><dd>${escapeHtml(opportunity.remuneration)}</dd></div></dl>
      ${applicationAction}
    </article>`;
  };

  const currentSearchOptions = () => ({
    query: search.value.trim(),
    opportunityType: typeFilter?.value || null,
    industry: industryFilter?.value.trim() || null,
    location: locationFilter?.value.trim() || null,
    workLocationType: workLocationFilter?.value || null,
    remuneration: remunerationFilter?.value || null,
    sort: sort?.value || "relevance"
  });

  const updateResultMeta = () => {
    const options = currentSearchOptions();
    count.textContent = String(totalResults);
    countLabel.textContent = totalResults === 1 ? "opportunity" : "opportunities";
    empty.textContent = options.query || options.opportunityType || options.industry || options.location || options.workLocationType || options.remuneration
      ? "No opportunities match those search options. Try changing or clearing a filter."
      : "No opportunities have been published yet. Check back soon.";
    empty.hidden = totalResults !== 0;
    if (resultsSummary) {
      const isRanked = options.query && options.sort === "relevance";
      resultsSummary.innerHTML = isRanked
        ? 'Sorted by relevance <span aria-hidden="true">↓</span>'
        : 'Showing most recently added <span aria-hidden="true">↓</span>';
    }
    if (loadMoreButton) loadMoreButton.hidden = !nextCursor || publicOpportunities.length >= totalResults;
  };

  const renderPublicResults = (results, append = false) => {
    const startIndex = append ? publicOpportunities.length : 0;
    if (append) {
      grid.insertAdjacentHTML("beforeend", results.map((opportunity, index) => opportunityMarkup(opportunity, startIndex + index)).join(""));
      publicOpportunities.push(...results);
    } else {
      publicOpportunities = [...results];
      grid.innerHTML = results.map(opportunityMarkup).join("");
    }
    updateResultMeta();
  };

  const updateLegacyResults = () => {
    const options = currentSearchOptions();
    const query = options.query.toLowerCase();
    const visible = opportunities.filter((opportunity) => {
      const searchable = [opportunity.title, opportunity.organisation_name, opportunity.opportunity_type, opportunity.industry, opportunity.location, opportunity.work_location_type, opportunity.description].join(" ").toLowerCase();
      return (!options.opportunityType || opportunity.opportunity_type === options.opportunityType)
        && (!options.industry || opportunity.industry?.toLowerCase().includes(options.industry.toLowerCase()))
        && (!options.location || opportunity.location?.toLowerCase().includes(options.location.toLowerCase()))
        && (!options.workLocationType || opportunity.work_location_type === options.workLocationType)
        && (!options.remuneration || opportunity.remuneration === options.remuneration)
        && searchable.includes(query);
    });
    totalResults = visible.length;
    nextCursor = null;
    renderPublicResults(visible);
  };

  const loadLegacyOpportunities = async () => {
    if (!client) return updateLegacyResults();
    const { data, error } = await client
      .from("opportunities")
      .select("id, title, organisation_name, opportunity_type, industry, location, work_location_type, remuneration, application_url, description, deadline, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error) {
      grid.innerHTML = '<p class="tracker-loading">The tracker is being connected. Please check back shortly.</p>';
      count.textContent = "0";
      countLabel.textContent = "opportunities";
      return;
    }
    opportunities = data;
    updateLegacyResults();
  };

  const isMissingSearchFunction = (error) => error?.code === "PGRST202"
    || error?.message?.includes("search_opportunities");

  const loadOpportunities = async ({ append = false } = {}) => {
    if (!client || !serverSearchAvailable) {
      if (!append) await loadLegacyOpportunities();
      return;
    }

    const requestVersion = ++searchRequestVersion;
    const options = currentSearchOptions();
    if (!append) {
      nextCursor = null;
      grid.innerHTML = '<p class="tracker-loading">Searching opportunities…</p>';
      empty.hidden = true;
      if (loadMoreButton) {
        loadMoreButton.hidden = true;
        loadMoreButton.disabled = false;
        loadMoreButton.textContent = "Load more opportunities";
      }
    } else if (loadMoreButton) {
      loadMoreButton.disabled = true;
      loadMoreButton.textContent = "Loading…";
    }

    const { data, error } = await client.rpc("search_opportunities", {
      p_query: options.query || null,
      p_opportunity_type: options.opportunityType,
      p_industry: options.industry,
      p_location: options.location,
      p_work_location_type: options.workLocationType,
      p_remuneration: options.remuneration,
      p_sort: options.sort,
      p_page_size: 24,
      p_cursor_rank: nextCursor?.rank ?? null,
      p_cursor_created_at: nextCursor?.createdAt ?? null,
      p_cursor_id: nextCursor?.id ?? null
    });

    if (requestVersion !== searchRequestVersion) return;
    if (loadMoreButton) {
      loadMoreButton.disabled = false;
      loadMoreButton.textContent = "Load more opportunities";
    }
    if (error) {
      if (isMissingSearchFunction(error)) {
        serverSearchAvailable = false;
        await loadLegacyOpportunities();
        return;
      }
      if (!append) {
        grid.innerHTML = '<p class="tracker-loading">We could not search the tracker. Please try again shortly.</p>';
        count.textContent = "0";
        countLabel.textContent = "opportunities";
      }
      return;
    }

    const results = data || [];
    if (!append) totalResults = Number(results[0]?.total_count || 0);
    const lastResult = results.at(-1);
    nextCursor = lastResult ? {
      rank: Number(lastResult.search_rank || 0),
      createdAt: lastResult.created_at,
      id: lastResult.id
    } : null;
    renderPublicResults(results, append);
  };

  const scheduleOpportunitySearch = () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => loadOpportunities(), 300);
  };

  const showSignIn = (message = "") => {
    signInView.hidden = false;
    accessStatus.textContent = message;
  };

  const getTrackerRole = async () => {
    const { data: role, error } = await client.rpc("current_tracker_role");
    return error ? null : role;
  };

  const updateAccountControls = () => {
    if (accountButton) accountButton.textContent = currentUser && trackerRole ? "Contributor workspace" : "Contributor sign in";
    if (signedInAs) signedInAs.textContent = currentUser && trackerRole ? `Signed in as ${currentUser.email} · ${trackerRole}` : "";
    if (manageButton) manageButton.hidden = !isTrackerEditor();
    if (membersButton) membersButton.hidden = !isTrackerAdmin();
    if (!trackerRole && workspace) workspace.hidden = true;
  };

  const refreshAccountState = async () => {
    if (!client) return;
    const { data: { user } } = await client.auth.getUser();
    currentUser = user;
    trackerRole = user ? await getTrackerRole() : null;
    updateAccountControls();
  };

  const setWorkspaceView = async (view = "submit") => {
    if (!trackerRole) return;
    const panels = { submit: submitPanel, manage: managementPanel, members: membersPanel };
    Object.entries(panels).forEach(([name, panel]) => { if (panel) panel.hidden = name !== view; });
    workspaceTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.workspaceView === view));
    if (view === "manage") await loadManagement();
    if (view === "members") await loadMembers();
  };

  const showWorkspace = async (view = "submit") => {
    if (!workspace || !trackerRole) return;
    workspace.hidden = false;
    await setWorkspaceView(view);
    workspace.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const managerFormMarkup = (opportunity) => `<form class="tracker-management-form" data-opportunity-id="${escapeHtml(opportunity.id)}">
    <div class="tracker-management-fields">
      <label>Role title<input name="title" value="${escapeHtml(opportunity.title)}" required></label>
      <label>Firm name<input name="organisation_name" value="${escapeHtml(opportunity.organisation_name)}" required></label>
      <label>Role type<select name="opportunity_type" required>${["Internship", "Graduate role", "Scholarship", "Apprenticeship", "Full-time", "Part-time", "Freelance", "Volunteering", "Programme", "Other"].map((type) => `<option${type === opportunity.opportunity_type ? " selected" : ""}>${type}</option>`).join("")}</select></label>
      <label>Industry<input name="industry" value="${escapeHtml(opportunity.industry)}" required></label>
      <label>Location<input name="location" value="${escapeHtml(opportunity.location)}" required></label>
      <label>Work location<select name="work_location_type" required>${["On-site", "Hybrid", "Remote"].map((type) => `<option${type === opportunity.work_location_type ? " selected" : ""}>${type}</option>`).join("")}</select></label>
      <label>Remuneration<select name="remuneration" required>${["Paid", "Stipend provided", "Unpaid"].map((type) => `<option${type === opportunity.remuneration ? " selected" : ""}>${type}</option>`).join("")}</select></label>
      <label>Application link<input name="application_url" type="url" value="${escapeHtml(opportunity.application_url || "")}" placeholder="Optional"></label>
      <label class="submission-full-width">Description<textarea name="description" rows="3" required>${escapeHtml(opportunity.description)}</textarea></label>
    </div>
    <div class="tracker-management-actions"><button class="member-primary-action" type="submit">Save changes</button><button class="tracker-remove-action" type="button" data-delete-opportunity>Remove opportunity</button></div>
  </form>`;

  const loadManagement = async () => {
    if (!client || !isTrackerEditor() || !managementList) return;
    managementStatus.textContent = "";
    managementList.innerHTML = '<p class="tracker-loading">Loading opportunities…</p>';
    const { data, error } = await client.from("opportunities").select("id, title, organisation_name, opportunity_type, industry, location, work_location_type, remuneration, application_url, description, created_at").order("created_at", { ascending: false });
    if (error) {
      managementList.innerHTML = "";
      managementStatus.textContent = "We could not load the management list.";
      return;
    }
    managementList.innerHTML = data.length ? data.map(managerFormMarkup).join("") : '<p class="tracker-loading">There are no opportunities to manage yet.</p>';
  };

  const memberFormMarkup = (member) => {
    const ownAccount = member.email === currentUser?.email?.toLowerCase();
    const passwordAction = ownAccount
      ? '<span class="tracker-own-password-note">Use Change password</span>'
      : '<button class="tracker-member-save" type="button" data-reset-password>New temporary password</button>';
    const removeAction = ownAccount ? "" : '<button class="tracker-remove-member" type="button" data-remove-member>Remove access</button>';
    return `<form class="tracker-member-row" data-member-email="${escapeHtml(member.email)}">
    <strong>${escapeHtml(member.email)}</strong>
    <label><span class="sr-only">Access level for ${escapeHtml(member.email)}</span><select name="role"><option value="member"${member.role === "member" ? " selected" : ""}>Contributor</option><option value="editor"${member.role === "editor" ? " selected" : ""}>Editor</option><option value="admin"${member.role === "admin" ? " selected" : ""}>Admin</option></select></label>
    <label class="tracker-member-active"><input name="active" type="checkbox"${member.active ? " checked" : ""}> Active</label>
    <button class="tracker-member-save" type="submit">Save</button>${passwordAction}${removeAction}
  </form>`;
  };

  const showTemporaryPassword = (email, password) => {
    temporaryPasswordEmail.textContent = email;
    temporaryPasswordValue.textContent = password;
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

  search.addEventListener("input", scheduleOpportunitySearch);
  [industryFilter, locationFilter].forEach((control) => control?.addEventListener("input", scheduleOpportunitySearch));
  [typeFilter, workLocationFilter, remunerationFilter, sort].forEach((control) => {
    control?.addEventListener("change", () => {
      window.clearTimeout(searchTimer);
      loadOpportunities();
    });
  });
  loadMoreButton?.addEventListener("click", () => {
    if (nextCursor) loadOpportunities({ append: true });
  });
  accountButton?.addEventListener("click", openAccount);
  document.querySelectorAll("[data-dialog-close]").forEach((button) => button.addEventListener("click", () => dialog?.close()));
  workspaceTabs.forEach((tab) => tab.addEventListener("click", () => setWorkspaceView(tab.dataset.workspaceView)));

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

  signOutButton?.addEventListener("click", async () => {
    await client?.auth.signOut();
    currentUser = null;
    trackerRole = null;
    updateAccountControls();
  });

  changePasswordButton?.addEventListener("click", () => {
    passwordForm?.reset();
    passwordStatus.textContent = "";
    passwordDialog?.showModal();
  });
  document.querySelectorAll("[data-password-close]").forEach((button) => button.addEventListener("click", () => passwordDialog?.close()));
  document.querySelectorAll("[data-temporary-password-close]").forEach((button) => button.addEventListener("click", () => temporaryPasswordDialog?.close()));
  copyTemporaryPasswordButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(temporaryPasswordValue.textContent);
      temporaryPasswordStatus.textContent = "Copied. Share it privately, then close this window.";
    } catch {
      temporaryPasswordStatus.textContent = "Copy is unavailable here. Select the password and copy it manually.";
    }
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
    if (!opportunity.application_url.trim()) opportunity.application_url = null;
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
    if (!values.application_url.trim()) values.application_url = null;
    button.disabled = true;
    managementStatus.textContent = "Saving changes…";
    const { error } = await client.from("opportunities").update(values).eq("id", form.dataset.opportunityId);
    button.disabled = false;
    if (error) {
      managementStatus.textContent = "We could not save those changes. Please check the fields and try again.";
      return;
    }
    managementStatus.textContent = "Changes saved.";
    await loadOpportunities();
  });

  managementList?.addEventListener("click", async (event) => {
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
    membersStatus.textContent = "Contributor created. Share the temporary password privately, then ask them to use Change password after signing in.";
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
    if (!window.confirm(`Create a new temporary password for ${form.dataset.memberEmail}?`)) return;
    button.disabled = true;
    membersStatus.textContent = "Creating temporary password…";
    const { data, error } = await invokeAdminFunction({ action: "reset_contributor_password", email: form.dataset.memberEmail });
    button.disabled = false;
    membersStatus.textContent = error ? error.message : "New temporary password created.";
    if (!error) showTemporaryPassword(form.dataset.memberEmail, data.temporaryPassword);
  });

  if (client) {
    client.auth.onAuthStateChange(() => window.setTimeout(refreshAccountState, 0));
    refreshAccountState();
  }
  loadOpportunities();
}
