const { useEffect, useState } = React;

const DEFAULTS = {
  username: "guest_ab2f758c@example.com",
  baseUrl: "https://sim-park.dev.ordino.global",
  queueId: "dragons_tail"
};

function Entitlement(props) {
  const { entitlement, reservationType, selectedEntitlements, toggleSelected } = props;
  const isSelected = () => selectedEntitlements.includes(entitlement);
  const isDisabled = () => !isCorrectReservationType()
    || isSessionSelected()
    || !entitlement.is_usable
    || !entitlement.is_eligible;

  const hasRequirement = () => entitlement.requires_entitlement && entitlement.requires_entitlement.length > 0;
  const isCorrectReservationType = () => !reservationType || entitlement.reservation_type === reservationType;
  const isSessionSelected = () => selectedEntitlements.some(e => e != entitlement && e.session_key === entitlement.session_key);
  const getGuestNickname = () => entitlement.metadata?.nickname || entitlement.session_key;
  const getTitle = () => entitlement.title;
  const formatTime = t => t && (dayjs(t).isBefore(dayjs()) ? "NOW" : dayjs(t).format("h:mm A"));
  const getRemainingUses = () => {
    switch (true)
    {
      case entitlement?.total_count > 0:
        return `${entitlement.remaining_count ?? 0}/${entitlement.total_count}`;
      case entitlement.remaining_count != null:
        return `${entitlement.remaining_count}`;
      default:
        return "Unlimited";
    }
  };
  const getReservationType = () => {
    const map = {
      parallel: "Parallel",
      premium: "Premium",
      time_bank: "Time Bank",
      reverse: "Reverse",
    }
    return map[entitlement.reservation_type];
  };
  const getUsabilityReason = () => {
    const usabilityReasonMap = {
      not_redeemed: "Not redeemed",
      already_reserved: `Already reserved on ${entitlement.reservation?.queue_name} for ${formatTime(entitlement.reservation?.ready_at)}`,
      not_redeemable: "Not redeemable",
      not_available: entitlement.available_from ? `Available from ${formatTime(entitlement.available_from)}` : "Not available",
      no_remaining_uses: "No remaining uses",
      expired: "Expired",
    };
    return usabilityReasonMap[entitlement.usability];
  }
  const getEligibilityReason = () => {
    const eligibilityReasonMap = {
      missing_required_session: "Missing required session",
      not_allowed_on_queue: "Not allowed on this queue",
      no_remaining_uses: "No remaining uses",
      not_enough_minutes: `Not enough minutes (${entitlement.minutes_remaining} remaining)`,
      not_allowed_for_reservation_type: "Not allowed for reservation type",
      no_entitlement: "No entitlement"
    };
    return eligibilityReasonMap[entitlement.eligibility];
  }
  const getReservationTypeReason = () => !isCorrectReservationType()
    && `Only ${reservationType} entitlements are selectable`;
  const getSessionKeyReason = () => isSessionSelected()
    && `An entitlement has already been selected for ${getGuestNickname()}`;
  const getRequirementReason = () => hasRequirement()
    && `Must be selected with a 'RAP User' entitlement`
  let getDescription = () => getUsabilityReason()
    || getEligibilityReason()
    || getReservationTypeReason()
    || getSessionKeyReason()
    || getRequirementReason();
  let onClick = () => toggleSelected(entitlement);

  return (
    <li key={entitlement.entitlement_key} className="entitlement-item">
      <button
        type="button"
        className={
          "entitlement-card " +
          `entitlement-card--${entitlement.reservation_type} ` +
          (isSelected() ? "entitlement-card-pressed " : "entitlement-card-unpressed ") +
          (isDisabled() ? "entitlement-card-disabled" : "")
        }
        aria-pressed={isSelected()}
        onClick={onClick}
        disabled={isDisabled()}
      >
        <div className="entitlement-card-top">
          <div className="entitlement-card-title">{getGuestNickname()}</div>
          <div className="entitlement-card-count">
            {getRemainingUses()}
          </div>
        </div>
        <div className="entitlement-card-subtitle">{getDescription()}&nbsp;</div>
        <div className="entitlement-card-bottom">
          <div className="entitlement-card-type">{getReservationType()}</div>
          <div className="entitlement-card-package">{getTitle()}</div>
        </div>
      </button>
    </li>
  );
}

function EntitlementPicker(props) {
  const {
    loadingEntitlements,
    entitlements,
    reservationType,
    selectedEntitlements,
    toggleSelected
  } = props;

  if (loadingEntitlements) {
    return <p>Loading entitlements...</p>;
  }

  return (
    <div>
      <p>Reservation type: {reservationType}</p>
      <ul className="entitlement-list">
        {entitlements.map((entitlement) => (
          <Entitlement
            key={entitlement.entitlement_key}
            entitlement={entitlement}
            reservationType={reservationType}
            selectedEntitlements={selectedEntitlements}
            toggleSelected={toggleSelected}
          />
        ))}
      </ul>
    </div>
  );
}

function Example() {
  const [username, setUsername] = useState(DEFAULTS.username);
  const [baseUrl, setBaseUrl] = useState(DEFAULTS.baseUrl);
  const [queueId, setQueueId] = useState(DEFAULTS.queueId);
  const [reservationType, setReservationType] = useState(null);
  const [entitlements, setEntitlements] = useState([]);
  const [selectedEntitlements, setSelectedEntitlements] = useState([]);
  const [loadingEntitlements, setLoadingEntitlements] = useState(true);
  const [reserveStatus, setReserveStatus] = useState("");
  const leadFieldStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px"
  };
  const leadFieldLabelStyle = {
    fontSize: "11px",
    fontWeight: 650,
    whiteSpace: "nowrap",
    minWidth: "72px"
  };
  const leadFieldInputStyle = {
    flex: "1 1 auto",
    padding: "6px 8px",
    minHeight: "30px",
    borderRadius: "8px"
  };

  async function loadEntitlements() {
    setLoadingEntitlements(true);
    if (!queueId) {
      setReserveStatus("Queue ID is required to load entitlements.");
      setLoadingEntitlements(false);
      return;
    }

    const api = new Api(baseUrl, username);
    try {
      const response = await api.getEntitlements(queueId);
      setEntitlements(response.items ?? []);
      setReserveStatus("Entitlements loaded.");
    } catch (error) {
      console.error(error);
      setReserveStatus("Could not load entitlements.");
    } finally {
      setLoadingEntitlements(false);
    }
  }

  function toggleSelected(entitlement) {
    setSelectedEntitlements((current) => {
      const nextSelected = current.includes(entitlement)
        ? current.filter((x) => x !== entitlement)
        : [...current, entitlement];

      setReservationType(nextSelected[0]?.reservation_type ?? null);
      return nextSelected;
    });
  }

  const hasRequirement = e => e.requires_entitlement?.length > 0;
  const isRequirementMet = e => selectedEntitlements.some(s => e.requires_entitlement?.includes(s.entitlement_key));
  const canReserve = () => selectedEntitlements.length > 0
      && selectedEntitlements.every(e => !hasRequirement(e) || isRequirementMet(e));
  const getReserveButtonText = () => canReserve()
    ? `Reserve for ${reservationType} with ${selectedEntitlements.length} guests`
    : "Cannot reserve";

  useEffect(() => {
    loadEntitlements();
  }, []);

  async function reserveQueue() {
    const entitlementKeys = selectedEntitlements
      .map((entitlement) => entitlement.entitlement_key)
      .filter(Boolean);

    if (!queueId) {
      setReserveStatus("Queue ID is required.");
      return;
    }
    if (selectedEntitlements.length === 0) {
      setReserveStatus("Select at least one entitlement.");
      return;
    }

    setReserveStatus("Reserving...");
    try {
      const api = new Api(baseUrl, username);
      await api.reserve(queueId, reservationType, entitlementKeys);
      setReserveStatus("Queue reserved successfully.");
    } catch (error) {
      console.error(error);
      setReserveStatus("Reserve failed. Please try again.");
    }
  }

  return (
    <section>
      <div className="lead-fields">
        <label className="lead-field lead-field--username" style={leadFieldStyle}>
          <span className="lead-field-label" style={leadFieldLabelStyle}>Username</span>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="lead-field-input username-input"
            style={leadFieldInputStyle}
            placeholder="Enter username"
          />
        </label>
        <label className="lead-field lead-field--base-url" style={leadFieldStyle}>
          <span className="lead-field-label" style={leadFieldLabelStyle}>Base URL</span>
          <input
            type="text"
            value={baseUrl}
            onChange={(event) => setBaseUrl(event.target.value)}
            className="lead-field-input base-url-input"
            style={leadFieldInputStyle}
            placeholder="Enter API base URL"
          />
        </label>
        <label className="lead-field lead-field--queue-id" style={leadFieldStyle}>
          <span className="lead-field-label" style={leadFieldLabelStyle}>Queue ID</span>
          <input
            type="text"
            value={queueId}
            onChange={(event) => setQueueId(event.target.value)}
            className="lead-field-input queue-id-input"
            style={leadFieldInputStyle}
            placeholder="Enter queue ID"
          />
        </label>
      </div>
      <div>
        <button
          type="button"
          onClick={loadEntitlements}
          disabled={loadingEntitlements}
          className="reserve-button"
        >
          {loadingEntitlements ? "Loading Entitlements..." : "Load Entitlements"}
        </button>
      </div>

      <EntitlementPicker
        loadingEntitlements={loadingEntitlements}
        entitlements={entitlements}
        reservationType={reservationType}
        selectedEntitlements={selectedEntitlements}
        toggleSelected={toggleSelected}
      />

      <button
        type="button"
        onClick={reserveQueue}
        disabled={!canReserve()}
        className="reserve-button reserve-button-primary"
      >
        {getReserveButtonText()}
      </button>

      {reserveStatus && <p className="status-message">{reserveStatus}</p>}
    </section>
  );
}

class Api {
  constructor(baseUrl, username) {
    this.authHeader = "Basic " + btoa(`${username}:unused-password!`);
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  }

  getUrl(path, queryParams) {
    let val = this.baseUrl + path;
    if (queryParams) {
      val += "?" + Object.entries(queryParams).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&");
    }
    return val;
  }

  async reserve(queueId, reservationType, entitlementKeys) {
    const response = await fetch(this.getUrl("/api/sessions/actions/reserve"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.authHeader
      },
      body: JSON.stringify({
        queue_id: queueId,
        session_keys: entitlementKeys,
        reservation_type: reservationType
      })
    });
    if (!response.ok) throw new Error("Reserve failed");
    return await response.json();
  }

  async getEntitlements(queueId) {
    const response = await fetch(this.getUrl("/api/entitlements", { queue_id: queueId }), {
      headers: {
        Authorization: this.authHeader
      }
    });
    if (!response.ok) throw new Error("Failed to load entitlements");
    return await response.json();
  }
}

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<Example />);
